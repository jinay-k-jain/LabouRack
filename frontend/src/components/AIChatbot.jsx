import React, { useState, useRef, useEffect } from 'react';

const QUICK_ACTIONS = [
  { label: '🔧 Book a Service', msg: 'I want to book a household repair service' },
  { label: '💰 Get Price Estimate', msg: 'What are the typical prices for common repairs?' },
  { label: '📋 My Bookings', msg: 'Show me my active bookings' },
  { label: '🛡️ Safety & Trust', msg: 'How do you verify workers?' },
  { label: '🚨 Emergency Help', msg: 'I have an emergency situation at home' },
];

const AI_RESPONSES = {
  greet: `👋 Hi! I'm **LabouRack AI Assistant**. I can help you with:

• Booking plumbers, electricians & more
• Getting instant price estimates
• Tracking your active bookings
• Emergency help & safety tips

How can I assist you today?`,

  book: `Great choice! Here's how to book a service:

1️⃣ **Choose a category** — Plumbing, Electrical, Carpentry, etc.
2️⃣ **Describe your issue** — Be specific for better matching
3️⃣ **Select a time** — Instant or scheduled
4️⃣ **Get matched** — Our AI finds the nearest verified pro

🔍 You can also use the **"Popular Quick Repairs"** section on your dashboard for one-tap booking.

Would you like me to help you pick a service category?`,

  price: `Here are typical price ranges in your area:

| Service | Starting Price |
|---------|---------------|
| 💧 Plumbing Repair | ₹200 – ₹800 |
| ⚡ Electrical Fix | ₹150 – ₹600 |
| 🔨 Carpentry Work | ₹300 – ₹1,200 |
| ❄️ AC Service & Repair | ₹400 – ₹1,500 |
| 🧹 Deep Cleaning | ₹500 – ₹2,000 |

💡 **Pro Tip**: Our AI Fair Price system compares worker quotes with market benchmarks so you never overpay!

Need a specific estimate? Tell me what needs fixing.`,

  bookings: `📋 To view your active bookings:

• Check the **"Live Task Active"** banner on your dashboard
• Each booking shows worker name, status, and ETA
• You can **call the worker** directly or **cancel** if needed

Your recent booking:
🔧 **Water Tap Repair** — Worker Rohit Kumar is on-site
📍 Status: Inspection Completed, Estimate Ready

Would you like to review the estimate?`,

  safety: `🛡️ **LabouRack Safety & Trust System**:

✅ **Aadhaar Verification** — All workers are verified via Aadhaar OTP
✅ **Background Checks** — Criminal record & identity verification
✅ **Real-Time Tracking** — Live GPS tracking during service
✅ **AI Price Protection** — ML-powered fair pricing, no hidden fees
✅ **Completion OTP** — Payment only released after you confirm satisfaction
✅ **24/7 Support** — Emergency help available anytime

Your safety is our #1 priority. Any concerns?`,

  emergency: `🚨 **Emergency Assistance**

For immediate help:

📞 **Emergency Helpline**: 1800-XXX-XXXX (24/7)
🚔 **Police**: 100
🚑 **Ambulance**: 108
🔥 **Fire**: 101

**For urgent home repairs:**
• Gas leak → Open windows, evacuate, call 1906
• Electrical fire → Switch off mains, use fire extinguisher
• Water flooding → Turn off main valve, call our emergency plumber

⚡ Our **Emergency SOS** button (in the header) connects you instantly to the nearest available worker.

Are you safe right now? How can I help?`,

  default: `I understand you need help with that. Let me assist you!

Here are some things I can help with:
• 🔧 **Booking services** — plumbing, electrical, carpentry
• 💰 **Price estimates** — AI-powered fair pricing
• 📋 **Booking status** — track your active jobs
• 🛡️ **Safety info** — worker verification process
• 🚨 **Emergency help** — urgent assistance

Could you tell me more about what you need?`,
};

function getAIResponse(message) {
  const lower = message.toLowerCase();
  if (lower.includes('book') || lower.includes('service') || lower.includes('repair') || lower.includes('hire'))
    return AI_RESPONSES.book;
  if (lower.includes('price') || lower.includes('cost') || lower.includes('estimate') || lower.includes('charge'))
    return AI_RESPONSES.price;
  if (lower.includes('booking') || lower.includes('track') || lower.includes('active') || lower.includes('status'))
    return AI_RESPONSES.bookings;
  if (lower.includes('safe') || lower.includes('verify') || lower.includes('trust') || lower.includes('aadhaar'))
    return AI_RESPONSES.safety;
  if (lower.includes('emergency') || lower.includes('urgent') || lower.includes('sos') || lower.includes('danger'))
    return AI_RESPONSES.emergency;
  return AI_RESPONSES.default;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: AI_RESPONSES.greet, time: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  function sendMessage(text) {
    if (!text.trim()) return;

    const userMsg = { role: 'user', text: text.trim(), time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const aiText = getAIResponse(text);
      setMessages(prev => [...prev, { role: 'ai', text: aiText, time: new Date() }]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleQuickAction(msg) {
    sendMessage(msg);
  }

  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Simple markdown-like rendering for bold and line breaks
  function renderText(text) {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      return (
        <span key={i}>
          {parts}
          {i < text.split('\n').length - 1 && <br />}
        </span>
      );
    });
  }

  return (
    <>
      {/* FLOATING CHAT BUTTON */}
      <button
        type="button"
        className={`chatbot-fab ${isOpen ? 'chatbot-fab--open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat' : 'Open AI Assistant'}
        title="LabouRack AI Assistant"
      >
        {isOpen ? (
          <span className="chatbot-fab-icon">✕</span>
        ) : (
          <>
            <span className="chatbot-fab-icon">💬</span>
            <span className="chatbot-fab-badge">AI</span>
          </>
        )}
      </button>

      {/* CHAT PANEL */}
      {isOpen && (
        <div className="chatbot-panel">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-left">
              <div className="chatbot-avatar">🤖</div>
              <div>
                <strong>LabouRack AI</strong>
                <span className="chatbot-status">
                  <span className="chatbot-status-dot" />
                  Online • Ready to help
                </span>
              </div>
            </div>
            <button
              type="button"
              className="chatbot-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-body" ref={chatBodyRef}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chatbot-msg ${msg.role === 'user' ? 'chatbot-msg--user' : 'chatbot-msg--ai'}`}
              >
                {msg.role === 'ai' && <div className="chatbot-msg-avatar">🤖</div>}
                <div className="chatbot-msg-bubble">
                  <div className="chatbot-msg-text">{renderText(msg.text)}</div>
                  <span className="chatbot-msg-time">{formatTime(msg.time)}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chatbot-msg chatbot-msg--ai">
                <div className="chatbot-msg-avatar">🤖</div>
                <div className="chatbot-msg-bubble chatbot-typing">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}

            {/* Quick actions after first message */}
            {messages.length === 1 && !isTyping && (
              <div className="chatbot-quick-actions">
                {QUICK_ACTIONS.map(action => (
                  <button
                    key={action.label}
                    type="button"
                    className="chatbot-quick-btn"
                    onClick={() => handleQuickAction(action.msg)}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form className="chatbot-input-bar" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything about LabouRack..."
              className="chatbot-input"
              autoFocus
            />
            <button
              type="submit"
              className="chatbot-send-btn"
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
            >
              ➤
            </button>
          </form>

          {/* Footer */}
          <div className="chatbot-footer">
            Powered by <strong>LabouRack AI</strong>
          </div>
        </div>
      )}
    </>
  );
}
