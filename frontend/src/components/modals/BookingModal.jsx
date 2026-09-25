import React, { useRef } from 'react';
import { initials } from '../../appLogic.js';
import VoiceInputButton from '../VoiceInputButton.jsx';

export default function BookingModal({ state, actions }) {
  const { bookingModal } = state;
  const fileInputRef = useRef(null);

  if (!bookingModal || !bookingModal.open || !bookingModal.worker) return null;

  const worker = bookingModal.worker;
  const baseRate = worker.rate || 300;
  const safetyFee = 20;
  const discount = 50;
  const totalPay = Math.max(0, baseRate + safetyFee - discount);
  const photos = bookingModal.photos || [];

  function handleFileChange(event) {
    const files = event.target.files;
    if (!files || !files.length) return;
    for (let i = 0; i < files.length; i++) {
      actions.addBookingPhoto(files[i]);
    }
    // Reset file input so user can choose same file again if desired
    event.target.value = '';
  }

  function handleDrop(event) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (!files || !files.length) return;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.startsWith('image/')) {
        actions.addBookingPhoto(files[i]);
      }
    }
  }

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
            <div className="field-label-row">
              <label htmlFor="bookingTaskInput">Describe the problem</label>
              <VoiceInputButton onClick={() => actions.showToast('Voice input is coming soon.')} />
            </div>
            <textarea
              id="bookingTaskInput"
              className="booking-input-box booking-problem-description"
              value={bookingModal.issue || 'Home Service'}
              onChange={e => actions.setBookingModalField('issue', e.target.value)}
              placeholder="Tell the worker what is happening, where it is, and when it started..."
            />
          </div>

          {/* PHOTO ATTACHMENT SECTION */}
          <div className="booking-form-field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label htmlFor="photoUploadInput" style={{ marginBottom: 0, cursor: 'pointer' }}>
                📷 Attach Photos of Issue <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(Optional)</span>
              </label>
              {photos.length > 0 && (
                <span style={{ fontSize: 11, color: '#10b981', fontWeight: 700 }}>
                  ✓ {photos.length} {photos.length === 1 ? 'photo' : 'photos'} attached
                </span>
              )}
            </div>

            <input
              id="photoUploadInput"
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            {photos.length > 0 ? (
              <div className="booking-photos-container">
                <div className="booking-photos-grid">
                  {photos.map(photo => (
                    <div key={photo.id} className="booking-photo-preview-item">
                      <img src={photo.dataUrl} alt={photo.name} className="booking-photo-img" />
                      <button
                        type="button"
                        className="booking-photo-remove-btn"
                        onClick={() => actions.removeBookingPhoto(photo.id)}
                        title="Remove photo"
                      >
                        ✕
                      </button>
                      <div className="booking-photo-caption">
                        <span className="booking-photo-name" title={photo.name}>{photo.name}</span>
                        <span className="booking-photo-size">{photo.size}</span>
                      </div>
                    </div>
                  ))}
                  {photos.length < 5 && (
                    <button
                      type="button"
                      className="booking-photo-add-more-btn"
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    >
                      <span style={{ fontSize: 22, lineHeight: 1 }}>+</span>
                      <span>Add More</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div
                className="booking-photo-dropzone"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInputRef.current && fileInputRef.current.click();
                  }
                }}
              >
                <div className="dropzone-icon-circle">📷</div>
                <div className="dropzone-text-group">
                  <strong>Click to attach photos or take a picture</strong>
                  <small>Upload images of the damaged area, broken appliance, or leak</small>
                </div>
                <span className="dropzone-badge">JPG, PNG, WebP up to 10MB</span>
              </div>
            )}
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
