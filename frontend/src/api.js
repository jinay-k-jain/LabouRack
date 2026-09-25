/**
 * LabouRack API Client
 * Connects frontend to the FastAPI backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const TOKEN_KEY = 'labourack_access_token';
export const REFRESH_TOKEN_KEY = 'labourack_refresh_token';
export const USER_KEY = 'labourack_user';

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveAuthTokens({ access_token, refresh_token, ...userData }) {
  if (access_token) localStorage.setItem(TOKEN_KEY, access_token);
  if (refresh_token) localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
  if (userData) localStorage.setItem(USER_KEY, JSON.stringify(userData));
}

export function clearAuthTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Universal API fetch helper
 */
async function apiRequest(endpoint, { method = 'GET', body = null, token = null } = {}) {
  const headers = {
    'Content-Type': 'application/json',
  };

  const authToken = token || getAuthToken();
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.detail || (typeof data === 'string' ? data : 'API Request Failed');
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export async function getAvailableWorkers(category) {
  const query = category ? `?category=${encodeURIComponent(category)}` : '';
  return apiRequest(`/workers/available${query}`);
}

export async function createBooking(body) {
  return apiRequest('/bookings/', { method: 'POST', body });
}

export async function getMyBookings() {
  return apiRequest('/bookings/me');
}

export async function cancelBookingRequest(bookingId) {
  return apiRequest(`/bookings/${bookingId}/cancel`, { method: 'POST', body: {} });
}

export async function getWorkerJobs() {
  return apiRequest('/workers/me/jobs');
}

export async function acceptWorkerJob(jobId) {
  return apiRequest(`/workers/me/jobs/${jobId}/accept`, { method: 'POST' });
}

export async function rejectWorkerJob(jobId) {
  return apiRequest(`/workers/me/jobs/${jobId}/reject`, { method: 'POST' });
}

export async function submitWorkerEstimate(jobId, body) {
  return apiRequest(`/workers/me/jobs/${jobId}/estimate`, { method: 'POST', body: { job_id: jobId, ...body } });
}

export async function setWorkerAvailability(online) {
  return apiRequest(`/workers/me/${online ? 'online' : 'offline'}`, { method: 'POST' });
}

export async function submitEstimateDecision(bookingId, body) {
  return apiRequest(`/bookings/${bookingId}/estimate-decision`, { method: 'POST', body });
}

// ── Authentication Endpoints ──────────────────────────────────────────────────

/**
 * Send OTP to a customer or worker mobile number
 * @param {string} phone - 10 digit phone number
 * @param {string} role - 'customer' | 'worker'
 * @param {string} flow - 'login' | 'register'
 */
export async function sendOtp(phone, role = 'customer', flow = 'login') {
  return apiRequest('/auth/send-otp', {
    method: 'POST',
    body: { phone, role, flow },
  });
}

/**
 * Verify OTP and retrieve JWT tokens
 * @param {string} phone - 10 digit phone number
 * @param {string} otp - 6 digit OTP string
 * @param {string} role - 'customer' | 'worker'
 * @param {string} flow - 'login' | 'register'
 */
export async function verifyOtp(phone, otp, role = 'customer', flow = 'login') {
  const data = await apiRequest('/auth/verify-otp', {
    method: 'POST',
    body: { phone, otp, role, flow },
  });
  saveAuthTokens(data);
  return data;
}

/**
 * Admin username + password login
 * @param {string} username
 * @param {string} password
 */
export async function adminLogin(username, password) {
  const data = await apiRequest('/auth/admin-login', {
    method: 'POST',
    body: { username, password },
  });
  saveAuthTokens(data);
  return data;
}

/**
 * Check backend health status
 */
export async function checkBackendHealth() {
  try {
    const data = await apiRequest('/health');
    return { ok: true, ...data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
