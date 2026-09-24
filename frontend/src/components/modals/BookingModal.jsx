import React from 'react';
import { initials } from '../../appLogic.js';

export default function BookingModal({ state, actions }) {
  const { bookingModal } = state;
  if (!bookingModal || !bookingModal.open || !bookingModal.worker) return null;

  const worker = bookingModal.worker;
  const baseRate = worker.rate || 300;
  const safetyFee = 20;
  const discount = 50;
  const totalPay = Math.max(0, baseRate + safetyFee - discount);

  return (
    <div className="modal-backdrop" onClick={actions.closeBookingModal}>
      <div className="booking-modal-card" onClick={e => e.stopPropagation()}>
        <div className="booking-modal-top">
          <span className="instant-booking-badge">⚡ Instant Booking</span>
          <button
            type="button"
            className="modal-close-btn"
            onClick={actions.closeBookingModal}
            title="Close"
          >
            ✕
          </button>
        </div>

        <h2 className="booking-modal-title">Book Service with {worker.name}</h2>
        <p className="booking-modal-subtitle">
          Aadhaar verified • {worker.distance || 0.8} km away • {worker.time || 5} mins ETA
        </p>

        {/* WORKER SUMMARY BOX */}
        <div className="booking-worker-summary-box">
          <div className="booking-worker-left">
            <div className={`worker-avatar hue-${worker.hue || 'orange'}`}>
              {initials(worker.name)}
            </div>
            <div className="booking-worker-info">
              <div className="worker-name-badge-row">
                <strong>{worker.name}</strong>
                <span className="pro-verified-badge">🛡️ Verified Pro</span>
              </div>
              <small className="worker-stats-text">
                ★ {worker.rating || 4.9} ({worker.reviews || 142} reviews) • 184+ jobs completed
              </small>
            </div>
          </div>
          <div className="booking-worker-rate-box">
            <strong className="worker-rate-value">₹{baseRate}</strong>
            <span className="rate-unit">/ hour</span>
          </div>
        </div>

        {/* FORM FIELDS */}
        <form onSubmit={actions.confirmBooking} className="booking-modal-form">
          <div className="booking-form-field">
            <label htmlFor="bookingTaskInput">Selected Problem / Task</label>
            <input
              id="bookingTaskInput"
              type="text"
              className="booking-input-box"
              value={bookingModal.issue || 'Home Service'}
              onChange={e => actions.setBookingModalField('issue', e.target.value)}
              placeholder="Describe what needs fixing..."
            />
          </div>

          <div className="booking-form-row">
            <div className="booking-form-field">
              <label htmlFor="bookingScheduleSelect">Schedule Time</label>
              <select
                id="bookingScheduleSelect"
                className="booking-select-box"
                value={bookingModal.timeSlot || '⚡ Immediate (within 15 mins)'}
                onChange={e => actions.setBookingModalField('timeSlot', e.target.value)}
              >
                <option value="⚡ Immediate (within 15 mins)">⚡ Immediate (within 15 mins)</option>
                <option value="🕒 Today (Next 1-2 hours)">🕒 Today (Next 1-2 hours)</option>
                <option value="📅 Tomorrow Morning (9 AM - 12 PM)">
                  📅 Tomorrow Morning (9 AM - 12 PM)
                </option>
                <option value="📅 Tomorrow Afternoon (2 PM - 6 PM)">
                  📅 Tomorrow Afternoon (2 PM - 6 PM)
                </option>
              </select>
            </div>

            <div className="booking-form-field">
              <label htmlFor="bookingAddressInput">Service Address</label>
              <input
                id="bookingAddressInput"
                type="text"
                className="booking-input-box"
                value={bookingModal.address || state.selectedLocation || 'Indiranagar, Bengaluru'}
                onChange={e => actions.setBookingModalField('address', e.target.value)}
                placeholder="Enter address..."
              />
            </div>
          </div>

          {/* PRICE BREAKDOWN TABLE */}
          <div className="booking-price-breakdown-box">
            <div className="price-row">
              <span className="price-row-label">Professional Hourly Rate</span>
              <span className="price-row-val">₹{baseRate}</span>
            </div>
            <div className="price-row">
              <span className="price-row-label">LabouRack Safety & Insurance Fee</span>
              <span className="price-row-val">₹{safetyFee}</span>
            </div>
            <div className="price-row discount-row">
              <span className="price-row-label">SIH Inaugural Promo Code (-₹50)</span>
              <span className="price-row-val">-₹{discount}</span>
            </div>
            <div className="price-divider" />
            <div className="price-row total-row">
              <strong className="total-label">Estimated Total Pay</strong>
              <strong className="total-val">₹{totalPay}</strong>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="booking-modal-actions">
            <button type="button" className="modal-cancel-btn" onClick={actions.closeBookingModal}>
              Cancel
            </button>
            <button type="submit" className="modal-confirm-btn">
              Confirm &amp; Dispatch Worker →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
