"""WebSocket router — real-time job notifications for workers & customers."""

import json
import asyncio
from typing import Dict, Set
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from app.core.security import decode_token

router = APIRouter(tags=["WebSocket"])

# ── Connection manager ────────────────────────────────────────────────────────
class ConnectionManager:
    def __init__(self):
        # user_id → set of WebSocket connections (multiple tabs/devices)
        self._connections: Dict[str, Set[WebSocket]] = {}

    async def connect(self, user_id: str, ws: WebSocket):
        await ws.accept()
        if user_id not in self._connections:
            self._connections[user_id] = set()
        self._connections[user_id].add(ws)

    def disconnect(self, user_id: str, ws: WebSocket):
        if user_id in self._connections:
            self._connections[user_id].discard(ws)
            if not self._connections[user_id]:
                del self._connections[user_id]

    async def send_to_user(self, user_id: str, payload: dict):
        """Send a JSON message to all connections of a specific user."""
        if user_id not in self._connections:
            return
        dead: Set[WebSocket] = set()
        for ws in list(self._connections[user_id]):
            try:
                await ws.send_json(payload)
            except Exception:
                dead.add(ws)
        for ws in dead:
            self._connections[user_id].discard(ws)

    async def broadcast(self, payload: dict):
        """Broadcast to ALL connected clients."""
        for conns in list(self._connections.values()):
            for ws in list(conns):
                try:
                    await ws.send_json(payload)
                except Exception:
                    pass

    @property
    def connected_users(self) -> list:
        return list(self._connections.keys())


manager = ConnectionManager()


# ── WebSocket endpoint ────────────────────────────────────────────────────────
@router.websocket("/ws")
async def websocket_endpoint(
    ws: WebSocket,
    token: str = Query(..., description="JWT access token"),
):
    """
    Connect with ?token=<access_token>
    
    Incoming messages from client:
      {"type": "ping"}                    → server replies {"type": "pong"}
      {"type": "worker:online"}           → mark worker online in Redis
      {"type": "worker:offline"}          → mark worker offline in Redis
    
    Server pushes to client:
      {"type": "job:new",       "data": {...}}   → new job request
      {"type": "booking:update","data": {...}}   → booking status change
      {"type": "estimate:reply","data": {...}}   → customer accepted/rejected estimate
    """
    payload = decode_token(token)
    if not payload:
        await ws.close(code=4001, reason="Invalid or expired token.")
        return

    user_id = payload.get("sub")
    role    = payload.get("role", "customer")
    await manager.connect(user_id, ws)

    # Notify client that connection is established
    await ws.send_json({
        "type": "connected",
        "user_id": user_id,
        "role": role,
        "message": "WebSocket connected to LabouRack real-time feed.",
    })

    try:
        while True:
            raw = await ws.receive_text()
            try:
                msg = json.loads(raw)
            except json.JSONDecodeError:
                await ws.send_json({"type": "error", "message": "Invalid JSON."})
                continue

            msg_type = msg.get("type")

            if msg_type == "ping":
                await ws.send_json({"type": "pong"})

            elif msg_type == "worker:online":
                from app.core.redis_client import set_worker_online
                await set_worker_online(user_id)
                await ws.send_json({"type": "status", "status": "online"})

            elif msg_type == "worker:offline":
                from app.core.redis_client import set_worker_offline
                await set_worker_offline(user_id)
                await ws.send_json({"type": "status", "status": "offline"})

            else:
                await ws.send_json({"type": "error", "message": f"Unknown message type: {msg_type}"})

    except WebSocketDisconnect:
        manager.disconnect(user_id, ws)
        if role == "worker":
            from app.core.redis_client import set_worker_offline
            await set_worker_offline(user_id)
