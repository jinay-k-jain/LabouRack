import React from 'react';
import { initials } from '../../appLogic.js';

export default function PaymentModal({ state, actions }) {
  const { paymentModal } = state;
  if (!paymentModal || !paymentModal.open) return null;

  const worker = paymentModal.worker;
  const visitingFee = paymentModal.visitingFee || 99;
  const safetyFee = paymentModal.safetyFee || 20;
  const discount = paymentModal.discount || 50;
  const payableNow = Math.max(0, visitingFee + safetyFee - discount);

  const paymentMethods = [
    { key: 'upi', icon: '📱', label: 'UPI / QR Code', sub: 'GPay, PhonePe, Paytm' },
    { key: 'card', icon: '💳', label: 'Debit / Credit Card', sub: 'Visa, Mastercard, RuPay' },
    { key: 'netbanking', icon: '🏦', label: 'Net Banking', sub: 'All Indian Banks' },
    { key: 'cod', icon: '💵', label: 'Pay After Service', sub: 'Cash or UPI to worker' },
  ];

  return (
    <div className="modal-backdrop" onClick={actions.closePaymentModal}>
      <div className="payment-modal-card" onClick={e => e.stopPropagation()}>
        <div className="payment-modal-top">
          <span className="payment-live-badge">⚡ Instant Dispatch &amp; Visiting Fee</span>
          <button
            type="button"
            className="modal-close-btn"
            onClick={actions.closePaymentModal}
            title="Close"
          >
            ✕
          </button>
        </div>

        {paymentModal.step === 'payment' && (
          <>
            <h2 className="payment-modal-title">Pay Visiting &amp; Diagnostic Fee</h2>
            <p className="payment-modal-subtitle">
              Adjusted against final repair bill • Guaranteed 15-min arrival in{' '}
              <strong>{state.selectedLocation}</strong>
            </p>

            {worker && (
              <div className="payment-worker-summary-box">
                <div className="payment-worker-left">
                  <div className={`worker-avatar hue-${worker.hue || 'orange'}`}>
                    {initials(worker.name)}
                  </div>
                  <div className="payment-worker-details">
                    <div className="payment-worker-title-row">
                      <strong>{worker.name}</strong>
                      <span className="pro-verified-badge">🛡️ Aadhaar Verified</span>
                    </div>
                    <small className="payment-worker-meta">
                      📍 {worker.distance || 0.8} km away • ⚡ {worker.time || 5} mins response time
                    </small>
                  </div>
                </div>
                <span className="auto-assign-pill">
                  {paymentModal.autoAssigned ? '🤖 Auto-Matched Pro' : 'Selected Pro'}
                </span>
              </div>
            )}

            <div className="payment-task-summary-row">
              <span className="payment-task-label">Service Request:</span>
              <strong className="payment-task-name">
                {paymentModal.issue || 'Household Service'}
              </strong>
            </div>

            {paymentModal.photos && paymentModal.photos.length > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                background: 'rgba(16, 185, 129, 0.06)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: 8,
                marginBottom: 12,
              }}>
                <span style={{ fontSize: 14 }}>📷</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#10b981' }}>
                  {paymentModal.photos.length} {paymentModal.photos.length === 1 ? 'photo' : 'photos'} attached:
                </span>
                <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
                  {paymentModal.photos.map(p => (
                    <img
                      key={p.id}
                      src={p.dataUrl}
                      alt={p.name}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 4,
                        objectFit: 'cover',
                        border: '1px solid #10b981',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="payment-breakdown-box">
              <div className="payment-breakdown-row">
                <span>Visiting &amp; Initial Inspection Fee</span>
                <span className="row-amount">₹{visitingFee}</span>
              </div>
              <div className="payment-breakdown-row">
                <span>LabouRack Safety &amp; Property Insurance Cover</span>
                <span className="row-amount">₹{safetyFee}</span>
              </div>
              <div className="payment-breakdown-row promo-row">
                <span>SIH Instant Discount (-₹50)</span>
                <span className="row-amount green-text">-₹{discount}</span>
              </div>
              <div className="payment-divider" />
              <div className="payment-breakdown-row total-payable-row">
                <div>
                  <strong className="payable-label">Amount Payable Now</strong>
                  <small className="payable-note">(Visiting Fee)</small>
                </div>
                <strong className="payable-val">₹{payableNow}</strong>
              </div>
            </div>

            <div className="payment-method-section">
              <label className="payment-method-label">Select Payment Method:</label>
              <div className="payment-method-grid">
                {paymentMethods.map(method => (
                  <button
                    key={method.key}
                    type="button"
                    className={`payment-method-option ${paymentModal.paymentMethod === method.key ? 'active' : ''}`}
                    onClick={() => actions.setPaymentMethod(method.key)}
                  >
                    <span className="method-icon">{method.icon}</span>
                    <div className="method-info">
                      <strong>{method.label}</strong>
                      <small>{method.sub}</small>
                    </div>
                    {paymentModal.paymentMethod === method.key && (
                      <span className="method-check">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="pay-and-dispatch-btn"
              onClick={actions.confirmPaymentAndDispatch}
            >
              {paymentModal.paymentMethod === 'cod' ? (
                <>Confirm Cash Booking &amp; Dispatch Worker ⚡ →</>
              ) : (
                <>Pay ₹{payableNow} &amp; Auto-Dispatch Worker ⚡ →</>
              )}
            </button>
          </>
        )}

        {paymentModal.step === 'assigning' && (
          <div className="assigning-loader-state">
            <div className="assigning-radar-wrap">
              <span className="radar-circle" />
              <span className="radar-icon">⚡</span>
            </div>
            <h3>Assigning &amp; Dispatching Nearest Pro...</h3>
            <p>
              Matching with{' '}
              <strong>{worker ? worker.name : 'nearest verified professional'}</strong> near{' '}
              {state.selectedLocation}
            </p>
            <div className="assigning-progress-bar">
              <div className="progress-fill" />
            </div>
          </div>
        )}

        {paymentModal.step === 'success' && (
          <div className="success-dispatch-state">
            <span className="success-dispatch-icon">🎉</span>
            <h3>Worker Auto-Dispatched Successfully!</h3>
            <p>
              <strong>{worker ? worker.name : 'Rohit Kumar'}</strong> is en route to your location.
            </p>
            <div className="dispatch-eta-pill">
              ⚡ ETA: {worker ? worker.time : 5} mins • OTP Security Code: 4821
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
