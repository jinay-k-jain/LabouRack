import React, { useState } from 'react';
import {
  availableLocations,
  formatPhone,
  householdCategories,
  initials,
  popularHouseholdProblems,
  useLabouRackApp,
  workerProfiles,
  workerSkills,
} from './appLogic.js';

const roleContent = {
  customer: { icon: '⌂', badge: 'customer-badge', title: 'Find Help Nearby', copy: 'Book trusted, Aadhaar-verified local professionals for household tasks.' },
  worker: { icon: '✦', badge: 'worker-badge', title: 'Turn Skills into Income', copy: 'Discover verified gig requests near your location and start earning.' },
  admin: { icon: '▣', badge: 'admin-badge', title: 'Platform Operations Center', copy: 'Manage worker verifications, security safety audits, and live metrics.' },
};

function Brand({ compact = false }) {
  return (
    <a className={compact ? 'dashboard-brand' : 'auth-brand'} href="#" onClick={event => event.preventDefault()}>
      <span className="brand-mark" aria-hidden="true">
        <i /><i /><i />
      </span>
      <span className="brand-text">LabouRack</span>
    </a>
  );
}

function Toast({ message }) {
  return message ? <div className="toast" role="status"><span className="toast-icon">✨</span>{message}</div> : null;
}

function AuthShell({ children }) {
  return (
    <main className="app-shell">
      <section className="auth-panel" aria-live="polite">
        <div className="auth-topbar">
          <Brand />
        </div>
        {children}
      </section>
    </main>
  );
}

function OtpInputs({ otp, actions }) {
  return (
    <div className="otp-inputs" aria-label="One-time password">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={node => actions.setOtpInputRef(index, node)}
          value={digit}
          inputMode="numeric"
          maxLength="1"
          aria-label={'Digit ' + (index + 1)}
          autoFocus={index === 0}
          onChange={event => actions.setOtpDigit(index, event.target.value)}
          onKeyDown={event => event.key === 'Backspace' && actions.focusPreviousOtp(index, !digit)}
          onPaste={actions.pasteOtp}
        />
      ))}
    </div>
  );
}

function Progress({ worker, step }) {
  const labels = worker ? ['Details', 'Verify Mobile', 'Aadhaar KYC', 'Skills & Profile'] : ['Details', 'Verify Mobile'];
  return (
    <div className="progress-steps" aria-label="Registration steps">
      {labels.map((label, index) => (
        <div key={label} className={'step ' + (index + 1 < step ? 'done' : index + 1 === step ? 'active' : '')}>
          {label}
        </div>
      ))}
    </div>
  );
}

function RegistrationShell({ worker = false, step, onBack, children }) {
  return (
    <AuthShell>
      <div className="flow-view">
        <button className="back-button" type="button" onClick={onBack}>
          ← <span>Back to sign in</span>
        </button>
        <div className="auth-heading compact">
          <p className="eyebrow">{worker ? 'WORKER ONBOARDING' : 'CUSTOMER SIGNUP'}</p>
          <h1>{worker ? 'Build your verified worker profile.' : 'Create your account in seconds.'}</h1>
          <p>{worker ? 'Complete identity verification to unlock local job requests in your neighborhood.' : 'Get instant access to trusted local plumbers, electricians, and technicians.'}</p>
        </div>
        <Progress worker={worker} step={step} />
        {children}
      </div>
    </AuthShell>
  );
}

function LoginScreen({ state, actions }) {
  const { role, phone, admin } = state;
  const detail = roleContent[role];
  return (
    <AuthShell>
      <div className="auth-view">
        <div className="auth-heading">
          <p className="eyebrow">SIH 2026 HYPERLOCAL PLATFORM</p>
          <h1>Welcome to LabouRack.</h1>
          <p>Select your user profile to test the platform prototype.</p>
        </div>
        <div className="role-switch" role="tablist" aria-label="Account type">
          {[
            ['customer', '⌂', 'Customer', 'customer-icon'],
            ['worker', '✦', 'Gig Worker', 'worker-icon'],
            ['admin', '▣', 'Admin', 'admin-icon'],
          ].map(([key, icon, label, iconClass]) => (
            <button
              key={key}
              className={'role-tab ' + (role === key ? 'active' : '')}
              type="button"
              role="tab"
              aria-selected={role === key}
              onClick={() => actions.setRole(key)}
            >
              <span className={'role-icon ' + iconClass}>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
        <form className="login-form active" onSubmit={actions.login} noValidate>
          <div className="role-description">
            <span className={'mini-badge ' + detail.badge}>{detail.icon}</span>
            <div>
              <strong>{detail.title}</strong>
              <small>{detail.copy}</small>
            </div>
          </div>
          {role === 'admin' ? (
            <>
              <label htmlFor="adminId">Admin Username / ID</label>
              <input
                id="adminId"
                className="text-input"
                value={admin.id}
                onChange={event => actions.setAdminId(event.target.value)}
                placeholder="Enter admin ID (e.g., admin)"
                autoComplete="username"
              />
              <label htmlFor="adminPassword">Password</label>
              <input
                id="adminPassword"
                className="text-input"
                value={admin.password}
                onChange={event => actions.setAdminPassword(event.target.value)}
                type="password"
                placeholder="Enter admin password"
                autoComplete="current-password"
              />
              <button className="primary-button" type="submit">
                Access Admin Portal <span>→</span>
              </button>
              <p className="admin-note">Demo Admin Credentials: any non-empty ID and Password.</p>
            </>
          ) : (
            <>
              <label htmlFor="loginPhone">Mobile Phone Number</label>
              <div className="phone-field">
                <span className="country-code">🇮🇳 +91</span>
                <input
                  id="loginPhone"
                  className="phone-input"
                  value={phone}
                  onChange={event => actions.setPhone(event.target.value)}
                  inputMode="numeric"
                  maxLength="10"
                  placeholder="Enter 10-digit phone number"
                  autoComplete="tel"
                />
              </div>
              <button className="primary-button" type="submit">
                Continue with OTP <span>→</span>
              </button>
              <p className="signup-line">
                First time using LabouRack?{' '}
                <button className="text-button" type="button" onClick={actions.startRegistration}>
                  {role === 'worker' ? 'Register as Gig Worker' : 'Create Customer Account'}
                </button>
              </p>
            </>
          )}
        </form>
        <p className="terms">
          By signing in, you agree to our <a href="#terms">Terms of Service</a> &amp; <a href="#privacy">Privacy Guarantee</a>.
        </p>
      </div>
    </AuthShell>
  );
}

function OtpScreen({ state, actions }) {
  return (
    <AuthShell>
      <div className="flow-view">
        <button className="back-button" type="button" onClick={actions.goToLogin}>
          ← <span>Back to sign in</span>
        </button>
        <div className="auth-heading compact">
          <p className="eyebrow">MOBILE VERIFICATION</p>
          <h1>Enter 6-digit OTP code.</h1>
          <p>
            We sent a verification code to <strong>{formatPhone(state.phone)}</strong>
          </p>
        </div>
        <form onSubmit={actions.verifyLoginOtp} noValidate>
          <OtpInputs otp={state.otp} actions={actions} />
          <p className="otp-hint">💡 Demo Hint: Enter any 6 digits (e.g. 1 2 3 4 5 6) to proceed.</p>
          <button className="primary-button" type="submit">
            Verify &amp; Enter Dashboard <span>→</span>
          </button>
        </form>
        <p className="resend-line">
          Didn't receive the code?{' '}
          <button className="text-button" type="button" onClick={actions.resendOtp}>
            Resend OTP
          </button>
        </p>
      </div>
    </AuthShell>
  );
}

function CustomerRegistration({ state, actions }) {
  const r = state.customerRegistration;
  const details = r.step === 1;
  return (
    <RegistrationShell step={r.step} onBack={actions.goToLogin}>
      <form onSubmit={actions.submitCustomerRegistration} noValidate>
        {details ? (
          <>
            <div className="register-field">
              <label htmlFor="customerName">Full Name</label>
              <input
                id="customerName"
                className="text-input"
                value={r.name}
                onChange={event => actions.setCustomerName(event.target.value)}
                placeholder="e.g. Alex Morgan"
                autoComplete="name"
              />
            </div>
            <div className="register-field">
              <label htmlFor="customerPhone">Mobile Number</label>
              <div className="inline-verify">
                <div className="phone-field">
                  <span className="country-code">+91</span>
                  <input
                    id="customerPhone"
                    className="phone-input"
                    value={r.phone}
                    onChange={event => actions.setCustomerPhone(event.target.value)}
                    inputMode="numeric"
                    maxLength="10"
                    placeholder="10-digit number"
                  />
                </div>
                <button
                  className={'verify-button ' + (r.otpSent ? 'verified' : '')}
                  type="button"
                  disabled={r.otpSent}
                  onClick={actions.sendCustomerOtp}
                >
                  {r.otpSent ? 'OTP Sent ✓' : 'Send OTP'}
                </button>
              </div>
              <p className="field-note">{r.otpSent ? 'OTP dispatched. Enter digits on next screen.' : 'We will send a one-time SMS verification code.'}</p>
            </div>
          </>
        ) : (
          <>
            <div className="role-description">
              <span className="mini-badge customer-badge">⌑</span>
              <div>
                <strong>Enter Mobile OTP</strong>
                <small>Sent to {formatPhone(r.phone)}</small>
              </div>
            </div>
            <OtpInputs otp={state.otp} actions={actions} />
            <p className="otp-hint">Use any 6 digits for this prototype.</p>
          </>
        )}
        <div className="registration-actions">
          {!details && (
            <button className="secondary-button" type="button" onClick={actions.backCustomerRegistration}>
              Back
            </button>
          )}
          <button className="primary-button" type="submit">
            {details ? 'Continue' : 'Create Account'} <span>→</span>
          </button>
        </div>
      </form>
    </RegistrationShell>
  );
}

function WorkerRegistration({ state, actions }) {
  const r = state.workerRegistration;
  const { step } = r;
  return (
    <RegistrationShell worker step={step} onBack={actions.goToLogin}>
      <form onSubmit={actions.submitWorkerRegistration} noValidate>
        {step === 1 && (
          <>
            <div className="register-field">
              <label htmlFor="workerName">Full Legal Name</label>
              <input
                id="workerName"
                className="text-input"
                value={r.name}
                onChange={event => actions.setWorkerName(event.target.value)}
                placeholder="As printed on your Aadhaar card"
                autoComplete="name"
              />
            </div>
            <div className="register-field">
              <label htmlFor="workerPhone">Mobile Number</label>
              <div className="inline-verify">
                <div className="phone-field">
                  <span className="country-code">+91</span>
                  <input
                    id="workerPhone"
                    className="phone-input"
                    value={r.phone}
                    onChange={event => actions.setWorkerPhone(event.target.value)}
                    inputMode="numeric"
                    maxLength="10"
                    placeholder="10-digit mobile number"
                  />
                </div>
                <button
                  className={'verify-button ' + (r.otpSent ? 'verified' : '')}
                  type="button"
                  disabled={r.otpSent}
                  onClick={actions.sendWorkerOtp}
                >
                  {r.otpSent ? 'OTP Sent ✓' : 'Send OTP'}
                </button>
              </div>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div className="role-description">
              <span className="mini-badge worker-badge">⌑</span>
              <div>
                <strong>Verify Mobile Number</strong>
                <small>Enter OTP code sent to {formatPhone(r.phone)}</small>
              </div>
            </div>
            <OtpInputs otp={state.otp} actions={actions} />
            <p className="otp-hint">Enter any 6 digits for this prototype.</p>
          </>
        )}
        {step === 3 && (
          <>
            <div className="role-description">
              <span className="mini-badge worker-badge">🛡️</span>
              <div>
                <strong>Aadhaar Identity KYC</strong>
                <small>Encrypted identity check ensures customer safety &amp; trust.</small>
              </div>
            </div>
            <div className="register-field">
              <label htmlFor="aadhaar">12-Digit Aadhaar Number</label>
              <div className="inline-verify">
                <input
                  id="aadhaar"
                  className="text-input"
                  value={r.aadhaar}
                  onChange={event => actions.setWorkerAadhaar(event.target.value)}
                  inputMode="numeric"
                  maxLength="12"
                  placeholder="e.g. 5489 1204 8921"
                />
                <button
                  className={'verify-button ' + (r.aadhaarVerified ? 'verified' : '')}
                  type="button"
                  disabled={r.aadhaarVerified}
                  onClick={actions.verifyAadhaar}
                >
                  {r.aadhaarVerified ? 'KYC Passed ✓' : 'Verify KYC'}
                </button>
              </div>
              <p className="field-note">🔒 Aadhaar numbers are salted, hashed, and never displayed publicly.</p>
            </div>
            <div className="register-field">
              <label htmlFor="aadhaarOtp">Aadhaar Linked Mobile OTP</label>
              <input
                id="aadhaarOtp"
                className="text-input"
                value={r.aadhaarOtp}
                onChange={event => actions.setWorkerAadhaarOtp(event.target.value)}
                inputMode="numeric"
                maxLength="6"
                placeholder="6-digit UIDAI verification code"
              />
            </div>
          </>
        )}
        {step === 4 && (
          <>
            <div className="register-field">
              <label>Select Work Specialties</label>
              <div className="skill-grid">
                {workerSkills.map(skill => (
                  <button
                    className={'skill-choice ' + (r.skills.includes(skill) ? 'selected' : '')}
                    key={skill}
                    type="button"
                    onClick={() => actions.toggleWorkerSkill(skill)}
                  >
                    {skill} {r.skills.includes(skill) ? '✓' : '+'}
                  </button>
                ))}
              </div>
              <p className="field-note skill-note">Pick at least one primary skill category.</p>
            </div>
            <div className="register-field">
              <label htmlFor="experience">Work Experience &amp; Description</label>
              <textarea
                className="experience-box"
                id="experience"
                value={r.experience}
                onChange={event => actions.setWorkerExperience(event.target.value)}
                placeholder="Describe your expertise (e.g., 5 years experience in domestic plumbing &amp; pipe repairing)."
              />
            </div>
            <label className="consent-label">
              <input type="checkbox" checked={r.consented} onChange={event => actions.setWorkerConsent(event.target.checked)} />
              <span>I confirm all shared details are accurate and agree to LabouRack background security checks.</span>
            </label>
          </>
        )}
        <div className="registration-actions">
          {step > 1 && (
            <button className="secondary-button" type="button" onClick={actions.backWorkerRegistration}>
              Back
            </button>
          )}
          <button className="primary-button" type="submit">
            {step === 4 ? 'Submit Profile for Verification' : step === 2 ? 'Verify Mobile' : 'Continue'} <span>→</span>
          </button>
        </div>
      </form>
    </RegistrationShell>
  );
}

function SuccessScreen({ state, actions }) {
  const firstName = state.session.name ? state.session.name.split(' ')[0] : 'there';
  return (
    <AuthShell>
      <div className="flow-view success-view">
        <div className="success-icon">✓</div>
        <p className="eyebrow">REGISTRATION COMPLETE</p>
        <h1>Welcome, {firstName}!</h1>
        <p>Your LabouRack account is ready. Explore nearby verified professionals or manage your service requests.</p>
        <button className="primary-button" type="button" onClick={actions.continueToDashboard}>
          Launch My Dashboard <span>→</span>
        </button>
      </div>
    </AuthShell>
  );
}

function PendingScreen({ actions }) {
  return (
    <AuthShell>
      <div className="flow-view success-view">
        <div className="success-icon success-icon--pending">⌛</div>
        <p className="eyebrow">VERIFICATION UNDER REVIEW</p>
        <h1>Profile Submitted Successfully!</h1>
        <p>LabouRack operations team is verifying your Aadhaar KYC and skill profile. You will receive access once approved.</p>
        <button className="primary-button" type="button" onClick={actions.goToLogin}>
          Return to Sign In <span>→</span>
        </button>
      </div>
    </AuthShell>
  );
}

function ProfileMenu({ state, actions }) {
  const { role, session, profileOpen } = state;
  const name = role === 'admin' ? 'LabouRack Administrator' : session.name || (role === 'worker' ? 'Gig Worker' : 'Alex Morgan');
  const location = state.selectedLocation || 'Indiranagar, Bengaluru';
  const label = role === 'admin' ? 'Operations Admin' : role === 'worker' ? 'Verified Gig Worker' : 'Customer Account';

  return (
    <div className="profile-menu">
      <button className="avatar" type="button" title="View profile" aria-label="View profile" aria-expanded={profileOpen} onClick={actions.toggleProfile}>
        {initials(name)}
      </button>
      {profileOpen && (
        <aside className="profile-popover" aria-label="Account details">
          <div className="profile-top">
            <span className="profile-avatar">{initials(name)}</span>
            <div>
              <p className="profile-name">{name}</p>
              <p className="profile-role">{label}</p>
            </div>
          </div>
          <div className="profile-details">
            {role === 'admin' ? (
              <Detail icon="▣" label="Access Level" value="Super Administrator" />
            ) : (
              <Detail icon="📍" label="Selected Location" value={location} />
            )}
            {role === 'customer' && <Detail icon="🛡️" label="Trust Status" value="Aadhaar Verified Customer" />}
            {role === 'worker' && (
              <>
                <Detail icon="✦" label="Active Skills" value={(session.skills || ['Plumbing', 'Electrical']).join(', ')} />
                <Detail icon="⭐" label="Worker Rating" value="4.9 ★ (142 reviews)" />
              </>
            )}
          </div>
          <button type="button" className="profile-signout" onClick={actions.signOut}>
            Sign out of LabouRack
          </button>
        </aside>
      )}
    </div>
  );
}

function Detail({ icon, label, value }) {
  return (
    <div className="profile-detail">
      <span className="profile-detail-icon">{icon}</span>
      <div>
        <span className="profile-detail-label">{label}</span>
        <span className="profile-detail-value">{value}</span>
      </div>
    </div>
  );
}

function AppHeader({ state, actions }) {
  const { role, searchQuery } = state;
  const customer = role === 'customer';

  return (
    <header className={'dashboard-header ' + (customer ? '' : 'dashboard-header--simple')}>
      <div className="header-brand-wrap" onClick={actions.closeHomeRepair} style={{ cursor: 'pointer' }} title="Go to Dashboard">
        <Brand compact />
      </div>

      {customer && (
        <button className="location-picker" type="button" onClick={actions.openLocationModal} title="Change active location">
          <span>📍</span>
          <span>{state.selectedLocation}</span>
          <b>⌄</b>
        </button>
      )}

      {customer && (
        <form className="issue-search" role="search" onSubmit={actions.searchDashboard}>
          <span aria-hidden="true">⌕</span>
          <input
            value={searchQuery}
            onChange={event => actions.setSearchQuery(event.target.value)}
            type="search"
            placeholder="Search service, plumber, electrician, fridge repair..."
            aria-label="Search for an issue or service"
          />
          <button type="submit">Search</button>
        </form>
      )}

      <div className="header-role-switcher" aria-label="Role preview">
        <button className={'role-pill ' + (role === 'customer' ? 'active' : '')} type="button" onClick={() => actions.setRole('customer')}>
          Customer
        </button>
        <button className={'role-pill ' + (role === 'worker' ? 'active' : '')} type="button" onClick={() => actions.setRole('worker')}>
          Gig Worker
        </button>
        <button className={'role-pill ' + (role === 'admin' ? 'active' : '')} type="button" onClick={() => actions.setRole('admin')}>
          Admin
        </button>
      </div>

      <div className="dashboard-actions">
        {customer && (
          <button className="help-circle" type="button" title="Active Bookings" onClick={() => actions.showToast('You have ' + state.activeBookings.length + ' active bookings')}>
            ⚡ <span className="badge-count">{state.activeBookings.length}</span>
          </button>
        )}
        <ProfileMenu state={state} actions={actions} />
      </div>
    </header>
  );
}

function LocationPickerModal({ state, actions }) {
  if (!state.locationModalOpen) return null;
  return (
    <div className="modal-backdrop" onClick={actions.closeLocationModal}>
      <div className="location-modal-card" onClick={e => e.stopPropagation()}>
        <div className="location-modal-header">
          <h3>📍 Select Service Locality</h3>
          <button type="button" className="modal-close-btn" onClick={actions.closeLocationModal}>✕</button>
        </div>
        <p className="location-modal-sub">Choose your current locality in Bengaluru for accurate 15-min worker dispatch.</p>

        <div className="location-list-grid">
          {(availableLocations || []).map(loc => (
            <button
              key={loc}
              type="button"
              className={`location-item-btn ${state.selectedLocation === loc ? 'active' : ''}`}
              onClick={() => actions.selectLocation(loc)}
            >
              <span>📍 {loc}</span>
              {state.selectedLocation === loc && <span className="active-check">✓ Active</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function BookingModal({ state, actions }) {
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
          <button type="button" className="modal-close-btn" onClick={actions.closeBookingModal} title="Close">
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
                <option value="📅 Tomorrow Morning (9 AM - 12 PM)">📅 Tomorrow Morning (9 AM - 12 PM)</option>
                <option value="📅 Tomorrow Afternoon (2 PM - 6 PM)">📅 Tomorrow Afternoon (2 PM - 6 PM)</option>
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
              Confirm & Dispatch Worker →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function WorkerCard({ worker, actions, state }) {
  if (!worker) return null;
  const available = worker.status === 'Available now';
  const isSaved = Boolean(state && Array.isArray(state.savedWorkers) && state.savedWorkers.includes(worker.name));
  const skills = Array.isArray(worker.skills) ? worker.skills : [];

  return (
    <article className="worker-card">
      <div className={'worker-avatar worker-avatar--' + (worker.hue || 'orange')}>
        {initials(worker.name)}
        <span className={'worker-presence ' + (available ? 'available' : '')} />
      </div>
      <div className="worker-summary">
        <div className="worker-name-row">
          <div>
            <h3>
              {worker.name} <span className="verified-badge" title="Aadhaar KYC Verified">🛡️ Verified</span>
            </h3>
            <p>Age {worker.age} • {worker.experience || '5 yrs exp'}</p>
          </div>
          <button
            className={'heart-button ' + (isSaved ? 'saved' : '')}
            type="button"
            title={isSaved ? 'Remove favorite' : 'Save favorite'}
            aria-label={'Save ' + worker.name}
            onClick={() => actions.toggleSaveWorker(worker.name)}
          >
            {isSaved ? '♥' : '♡'}
          </button>
        </div>
        <p className="worker-rating">
          <span>★</span> {worker.rating} <small>({worker.reviews} reviews • {worker.completedJobs || 120}+ jobs)</small>
        </p>
        <div className="worker-tags">
          {skills.map(skill => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </div>
      <div className="worker-booking">
        <p>📍 {worker.distance} km away <small>({worker.time} mins response)</small></p>
        <span className={'availability ' + (available ? 'availability--now' : 'availability--busy')}>
          {worker.status}
        </span>
        <strong>₹{worker.rate}<small>/hour</small></strong>
        <button
          type="button"
          className={available ? 'book-button' : 'notify-button'}
          onClick={() => (available ? actions.bookWorker(worker) : actions.notifyWorker(worker))}
        >
          {available ? '⚡ Book Now' : 'Notify Availability'}
        </button>
      </div>
    </article>
  );
}

function HomeRepairFlow({ state, actions }) {
  const { view, category, issue, filter, workers, services, query, serviceFilter = 'all', serviceSort = 'relevance', hasMatches } = state.homeRepair;
  const [localQuery, setLocalQuery] = useState(query || '');

  React.useEffect(() => {
    setLocalQuery(query || '');
  }, [query]);

  const heading =
    view === 'categories'
      ? 'What service do you need today?'
      : view === 'services'
        ? (category ? `${category.name} Services Offered` : 'Services Matching Your Search')
        : view === 'issues'
          ? (category ? `${category.name} Problems` : 'Select Problem')
          : (category ? category.workerLabel : 'Verified Local Workers');

  const copy =
    view === 'categories'
      ? 'Choose a category to find certified local gig workers near you.'
      : view === 'services'
        ? `Select a specific service package for "${query || (category ? category.name : 'your search')}" to compare verified nearby workers.`
        : view === 'issues'
          ? 'Pick the issue that best matches your situation.'
          : (category ? category.workerCopy : 'Available verified workers near your location.');

  const workerFilters = [
    ['all', 'All Workers'],
    ['nearby', 'Within 3 km'],
    ['rated', 'Top Rated (4.8+ ★)'],
    ['available', 'Available Now 🟢'],
  ];

  const serviceFilterChips = [
    { key: 'all', label: 'All Packages', icon: '📦' },
    { key: 'express', label: '⚡ Express Match', icon: '⚡' },
    { key: 'top-rated', label: '★ Top Rated Pro', icon: '★' },
    { key: 'budget', label: '💰 Under ₹350', icon: '💰' },
  ];

  const popularQueries = [
    { label: '🧊 Fridge Repair', query: 'fridge repair' },
    { label: '💧 Leaking Tap', query: 'leaking tap' },
    { label: '⚡ AC Servicing', query: 'ac service' },
    { label: '🪚 Carpenter', query: 'carpenter' },
    { label: '🔌 Appliance Diagnostic', query: 'appliance' },
    { label: '✨ Deep Cleaning', query: 'kitchen deep cleaning' },
  ];

  // Filter services
  let displayServices = [...(services || [])];
  if (serviceFilter === 'express') {
    displayServices = displayServices.filter(s => (s.estTime && s.estTime.includes('15')) || (s.badge && (s.badge.includes('Popular') || s.badge.includes('Quick'))));
  } else if (serviceFilter === 'top-rated') {
    displayServices = displayServices.filter(s => s.badge && (s.badge.includes('Verified') || s.badge.includes('Popular') || s.badge.includes('Specialist') || s.badge.includes('Hygiene')));
  } else if (serviceFilter === 'budget') {
    displayServices = displayServices.filter(s => s.price <= 350);
  }

  // Sort services
  if (serviceSort === 'price-asc') {
    displayServices.sort((a, b) => a.price - b.price);
  } else if (serviceSort === 'price-desc') {
    displayServices.sort((a, b) => b.price - a.price);
  } else if (serviceSort === 'eta') {
    displayServices.sort((a, b) => parseInt(a.estTime || '20') - parseInt(b.estTime || '20'));
  }

  const handleRefineSubmit = (e) => {
    e.preventDefault();
    if (localQuery.trim()) {
      actions.searchByQuery(localQuery.trim());
    }
  };

  return (
    <main className="app-shell service-shell">
      <section className="service-panel">
        <header className="service-header">
          <button
            type="button"
            className="service-back-btn"
            onClick={view === 'categories' ? actions.closeHomeRepair : actions.goBackInHomeRepair}
            title="Go Back to Dashboard"
          >
            <span className="back-arrow">←</span>
            <span>Back</span>
          </button>

          <div
            className="header-location-pill"
            onClick={actions.openLocationModal}
            title="Change active locality"
          >
            <span className="location-pin-icon">📍</span>
            <span className="location-label">Active Locality:</span>
            <strong className="location-name">{state.selectedLocation}</strong>
            <span className="location-dropdown-arrow">▾</span>
          </div>
        </header>

        {view === 'services' && (
          <div className="search-refine-bar">
            <form onSubmit={handleRefineSubmit} className="search-refine-form">
              <span className="search-refine-icon">🔍</span>
              <input
                type="search"
                className="search-refine-input"
                placeholder="Refine search: e.g. fridge repair, plumber, AC service..."
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
              />
              {localQuery && (
                <button
                  type="button"
                  className="search-refine-clear"
                  onClick={() => {
                    setLocalQuery('');
                    actions.clearSearch();
                  }}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
              <button type="submit" className="search-refine-btn">
                Search
              </button>
            </form>

            <div className="search-tags-scroll">
              <span className="search-tags-label">Quick filter:</span>
              {popularQueries.map((item) => (
                <button
                  key={item.query}
                  type="button"
                  className={`search-query-chip ${query && query.toLowerCase() === item.query ? 'active' : ''}`}
                  onClick={() => {
                    setLocalQuery(item.query);
                    actions.searchByQuery(item.query);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <section className="service-intro">
          <p className="eyebrow">HYPERLOCAL SERVICE DISCOVERY</p>
          <h1>{heading}</h1>
          <p>{copy}</p>
        </section>

        {view === 'categories' && (
          <div className="household-grid">
            {householdCategories.map(item => (
              <button key={item.id} type="button" className="household-category" onClick={() => actions.chooseHouseholdCategory(item)}>
                <span>{item.icon}</span>
                <div>
                  <span className="category-badge">{item.badge || 'Available'}</span>
                  <strong>{item.name}</strong>
                  <small>{item.description}</small>
                </div>
                <b>→</b>
              </button>
            ))}
          </div>
        )}

        {view === 'services' && (
          <div className="services-discovery-container">
            {/* Search Hero Context Banner */}
            <div className="search-hero-banner">
              <div className="search-hero-icon-wrap">
                <span className="search-hero-icon">{category ? category.icon : '🔍'}</span>
                <span className="search-hero-pulse"></span>
              </div>

              <div className="search-hero-details">
                <div className="search-hero-top-pills">
                  <span className="hero-pill category-pill">
                    {category ? category.name : 'Home Services'}
                  </span>
                  {hasMatches === false ? (
                    <span className="hero-pill fallback-pill">⚠️ Showing Top Recommended Services</span>
                  ) : (
                    <span className="hero-pill matches-pill">✓ Exact Matches Found</span>
                  )}
                </div>

                <h2 className="search-hero-heading">
                  {query ? (
                    <>Results for <span className="highlight-term">"{query}"</span></>
                  ) : (
                    category ? category.name : 'Explore All Services'
                  )}
                </h2>

                <div className="search-hero-features-row">
                  <div className="hero-feature-item">
                    <span className="feature-icon">⚡</span>
                    <span>Average <strong>15–20 min</strong> arrival</span>
                  </div>
                  <div className="hero-feature-item">
                    <span className="feature-icon">🛡️</span>
                    <span><strong>₹10,000</strong> LabouRack Property Protection</span>
                  </div>
                  <div className="hero-feature-item">
                    <span className="feature-icon">📍</span>
                    <span>Near <strong>{state.selectedLocation}</strong></span>
                  </div>
                  <div className="hero-feature-item">
                    <span className="feature-icon">🪪</span>
                    <span><strong>100%</strong> Aadhaar KYC Verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter & Sort Toolbar */}
            <div className="search-toolbar">
              <div className="filter-chips-group">
                {serviceFilterChips.map(chip => (
                  <button
                    key={chip.key}
                    type="button"
                    className={`filter-chip ${serviceFilter === chip.key ? 'active' : ''}`}
                    onClick={() => actions.setServiceFilter(chip.key)}
                  >
                    <span>{chip.icon}</span> {chip.label}
                  </button>
                ))}
              </div>

              <div className="sort-select-wrap">
                <label htmlFor="serviceSortSelect">Sort by:</label>
                <select
                  id="serviceSortSelect"
                  value={serviceSort}
                  onChange={(e) => actions.setServiceSort(e.target.value)}
                  className="sort-dropdown"
                >
                  <option value="relevance">Best Match</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="eta">Fastest Response (ETA)</option>
                </select>
              </div>
            </div>

            {/* Services Grid */}
            {displayServices.length > 0 ? (
              <div className="services-grid">
                {displayServices.map((service, index) => (
                  <div key={service.id || service.name || index} className="service-offer-card" onClick={() => actions.chooseService(service)}>
                    <div className="service-card-header">
                      <div className="service-card-icon-title">
                        <span className="service-icon">{service.icon || (category ? category.icon : '✦')}</span>
                        <div>
                          <h3>{service.name}</h3>
                          <div className="service-rating-row">
                            <span className="rating-stars">★★★★★</span>
                            <span className="rating-score">4.8</span>
                            <span className="rating-count">(120+ booked)</span>
                          </div>
                        </div>
                      </div>
                      <span className="service-badge">{service.badge || 'Verified Pro'}</span>
                    </div>

                    <p className="service-desc">{service.description}</p>

                    {service.included && (
                      <ul className="service-included-list">
                        {service.included.map((item, idx) => (
                          <li key={idx}><span className="check-icon">✓</span> {item}</li>
                        ))}
                      </ul>
                    )}

                    <div className="service-card-footer">
                      <div className="price-box">
                        <span className="price-label">Upfront Estimated Rate</span>
                        <div className="price-value-row">
                          <strong className="service-price">₹{service.price}</strong>
                          <span className="price-subtext">no hidden fee</span>
                        </div>
                        <small className="eta-tag">⚡ {service.estTime || '15 mins response'}</small>
                      </div>
                      <div className="service-card-footer-actions">
                        <button
                          type="button"
                          className="express-book-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            actions.expressAutoAssign(service);
                          }}
                          title="Direct checkout & auto-assign nearest worker"
                        >
                          ⚡ Express Book (₹69)
                        </button>
                        <button type="button" className="choose-service-btn">
                          Compare Pros →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="search-empty-card">
                <span className="empty-search-icon">🔍</span>
                <h3>No service packages match this filter</h3>
                <p>Try switching filters or searching with different keywords.</p>
                <button
                  type="button"
                  className="reset-filter-btn"
                  onClick={() => {
                    actions.setServiceFilter('all');
                    actions.setServiceSort('relevance');
                  }}
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Direct Worker Matches Preview Strip */}
            <div className="nearby-workers-preview-section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">DIRECT MATCH PROS</p>
                  <h2>Verified Workers Ready for {query || (category ? category.name : 'this task')}</h2>
                </div>
                <span className="workers-ready-badge">🟢 {state.homeRepair.workers.length || 5} Active Now</span>
              </div>

              <div className="nearby-workers-horizontal-scroll">
                {(state.homeRepair.workers.length ? state.homeRepair.workers : workerProfiles).slice(0, 4).map((worker) => (
                  <div key={worker.name} className="worker-mini-preview-card" onClick={() => actions.chooseHouseholdIssue(query || 'Home Service')}>
                    <div className="worker-avatar-badge-wrap">
                      <div className={`worker-avatar hue-${worker.hue}`}>
                        {initials(worker.name)}
                      </div>
                      <span className="online-dot" title="Available now"></span>
                    </div>

                    <div className="worker-mini-info">
                      <strong>{worker.name}</strong>
                      <small className="worker-mini-skills">
                        ★ {worker.rating} • {worker.reviews} reviews
                      </small>
                      <span className="worker-mini-meta">
                        📍 {worker.distance} km • ⚡ {worker.time} mins away
                      </span>
                      <span className="worker-rate-tag">₹{worker.rate}/hr</span>
                    </div>

                    <button type="button" className="mini-book-btn" onClick={(e) => {
                      e.stopPropagation();
                      actions.bookWorker(worker);
                    }}>
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'issues' && (
          <div className="issue-list">
            {category && category.issues && category.issues.map(item => (
              <button key={item} type="button" onClick={() => actions.chooseHouseholdIssue(item)}>
                <span>{category.icon}</span>
                <div>
                  <strong>{item}</strong>
                  <small>Match with nearby {category.workerType}s</small>
                </div>
                <b>→</b>
              </button>
            ))}
          </div>
        )}

        {view === 'workers' && (
          <>
            <div className="selected-problem-card">
              <div className="selected-problem-left">
                <span className="selected-problem-icon">{category ? category.icon : '✦'}</span>
                <div className="selected-problem-details">
                  <span className="selected-problem-label">SELECTED TASK / SERVICE</span>
                  <h3 className="selected-problem-title">{issue || (category ? category.name : 'Home Service')}</h3>
                  <span className="selected-problem-sub">
                    ⚡ Matching nearby Aadhaar-verified {category ? category.workerType : 'gig worker'}s
                  </span>
                </div>
              </div>
              <button type="button" className="change-service-btn" onClick={actions.goBackInHomeRepair}>
                ✏️ Change Service
              </button>
            </div>

            <div className="worker-filters-bar">
              <span className="worker-filters-label">Filter Pros:</span>
              <div className="worker-filters-chips">
                {workerFilters.map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    className={`worker-filter-chip ${filter === key ? 'active' : ''}`}
                    onClick={() => actions.setWorkerFilter(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="worker-list">
              {workers.length ? (
                workers.map(worker => <WorkerCard key={worker.name} worker={worker} actions={actions} state={state} />)
              ) : (
                <div className="empty-state">
                  <span className="empty-icon">🔍</span>
                  <p className="empty-workers">No workers match this filter currently. Try clearing filters or expanding your radius.</p>
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function Dashboard({ state, actions }) {
  const { role, searchQuery, dashboard } = state;
  const customer = role === 'customer';
  const [activeTab, setActiveTab] = useState('all');

  if (customer && state.homeRepair.view !== 'home') {
    return <HomeRepairFlow state={state} actions={actions} />;
  }

  return (
    <main className="app-shell dashboard-shell">
      <section className="dashboard-panel">
        {/* TOP HEADER */}
        <header className={'dashboard-header ' + (customer ? '' : 'dashboard-header--simple')}>
          <Brand compact />

          {customer && (
            <button className="location-picker" type="button" onClick={actions.openLocationModal}>
              <span>📍</span>
              <span>{state.selectedLocation}</span>
              <b>⌄</b>
            </button>
          )}

          {customer && (
            <form className="issue-search" role="search" onSubmit={actions.searchDashboard}>
              <span aria-hidden="true">⌕</span>
              <input
                value={searchQuery}
                onChange={event => actions.setSearchQuery(event.target.value)}
                type="search"
                placeholder="Search service, plumber, electrician..."
                aria-label="Search for an issue or service"
              />
              <button type="submit">Search</button>
            </form>
          )}

          {/* ROLE QUICK SWITCHER PILL */}
          <div className="header-role-switcher" aria-label="Role preview">
            <button className={'role-pill ' + (role === 'customer' ? 'active' : '')} type="button" onClick={() => actions.setRole('customer')}>
              Customer
            </button>
            <button className={'role-pill ' + (role === 'worker' ? 'active' : '')} type="button" onClick={() => actions.setRole('worker')}>
              Gig Worker
            </button>
            <button className={'role-pill ' + (role === 'admin' ? 'active' : '')} type="button" onClick={() => actions.setRole('admin')}>
              Admin
            </button>
          </div>

          <div className="dashboard-actions">
            {customer && (
              <button className="help-circle" type="button" title="Active Bookings" onClick={() => actions.showToast('You have ' + state.activeBookings.length + ' active bookings')}>
                ⚡ <span className="badge-count">{state.activeBookings.length}</span>
              </button>
            )}
            <ProfileMenu state={state} actions={actions} />
          </div>
        </header>

        {/* ACTIVE BOOKING WIDGET FOR CUSTOMER */}
        {customer && state.activeBookings.length > 0 && (
          <div className="active-booking-banner">
            <div className="booking-status-pulse">
              <span className="pulse-dot" />
              <span>LIVE TASK ACTIVE</span>
            </div>
            {state.activeBookings.map(b => (
              <div key={b.id} className="active-booking-card">
                <span className="booking-icon">{b.categoryIcon || '💧'}</span>
                <div className="booking-info">
                  <strong>{b.issue}</strong>
                  <small>Assigned Pro: <b>{b.workerName}</b> • {b.status} ({b.eta})</small>
                </div>
                <div className="booking-actions">
                  <button className="track-button" type="button" onClick={() => actions.showToast('📞 Contacting ' + b.workerName + ' (OTP Code 4821)')}>
                    📞 Call Worker
                  </button>
                  <button className="cancel-text-btn" type="button" onClick={() => actions.cancelBooking(b.id)}>
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* HERO SECTION FOR CUSTOMER */}
        {customer && (
          <section className="hero-banner">
            <div className="hero-content">
              <div className="hero-badge">
                <span>🛡️ SIH 2026 PROTOTYPE</span>
                <p>Aadhaar-Verified Local Gig Network</p>
              </div>
              <h1>Instant Household Help, Verified &amp; On-Demand.</h1>
              <p>Connect with top-rated plumbers, electricians, and technicians in <strong>{state.selectedLocation}</strong> within 15 minutes.</p>

              <div className="hero-stats-row">
                <div className="stat-pill">
                  <strong>500+</strong>
                  <small>Verified Local Pros</small>
                </div>
                <div className="stat-pill">
                  <strong>4.9 ★</strong>
                  <small>Avg Rating (12k+ Jobs)</small>
                </div>
                <div className="stat-pill">
                  <strong>&lt; 15 mins</strong>
                  <small>Avg Response Time</small>
                </div>
                <div className="stat-pill">
                  <strong>₹0</strong>
                  <small>Hidden Service Fees</small>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* WORKER / ADMIN DASHBOARD INTRO */}
        {!customer && (
          <section className="dashboard-intro" aria-labelledby="dashboardTitle">
            <p className="eyebrow">{role.toUpperCase()} PORTAL</p>
            <h1 id="dashboardTitle">{dashboard.heading}</h1>
            <p>{dashboard.copy}</p>
          </section>
        )}

        {/* CUSTOMER QUICK HELP SECTION */}
        {customer && (
          <section className="dashboard-popular" aria-labelledby="popularProblems">
            <div className="section-heading">
              <div>
                <p className="eyebrow">POPULAR QUICK REPAIRS</p>
                <h2 id="popularProblems">What needs urgent fixing?</h2>
              </div>
              <button className="text-button" type="button" onClick={actions.openHomeRepair}>
                Explore All Services →
              </button>
            </div>

            <div className="popular-problem-grid">
              {popularHouseholdProblems.map(problem => (
                <button
                  key={problem.label}
                  type="button"
                  className="popular-problem"
                  onClick={() => actions.openPopularProblem(problem.categoryId, problem.issue)}
                >
                  <span>{problem.icon}</span>
                  <div>
                    <strong>{problem.label}</strong>
                    <small>{problem.description}</small>
                    <div className="problem-meta">
                      <span className="price-tag">Starts @ ₹{problem.price}</span>
                      <span className="eta-tag">⚡ {problem.estTime}</span>
                    </div>
                  </div>
                  <b>→</b>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ALL HOUSEHOLD SERVICES GRID */}
        {customer && (
          <section className="dashboard-content" id="services">
            <div className="section-heading">
              <div>
                <p className="eyebrow">SERVICE CATEGORIES</p>
                <h2>Browse All Household Specialties</h2>
              </div>
              <button className="text-button" type="button" onClick={actions.openHomeRepair}>
                View All Categories →
              </button>
            </div>

            <div className="household-grid">
              {householdCategories.slice(0, 6).map(cat => (
                <button key={cat.id} type="button" className="household-category" onClick={() => actions.chooseHouseholdCategory(cat)}>
                  <span>{cat.icon}</span>
                  <div>
                    <span className="category-badge">{cat.badge}</span>
                    <strong>{cat.name}</strong>
                    <small>{cat.description}</small>
                  </div>
                  <b>→</b>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* TOP VERIFIED LOCAL WORKERS DIRECT DISCOVERY */}
        {customer && (
          <section className="dashboard-content nearby-workers-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">LIVE WORKER RADAR</p>
                <h2>Top Verified Workers Near {state.selectedLocation}</h2>
              </div>
              <span className="radar-status">🟢 14 Workers Online Now</span>
            </div>

            <div className="worker-list">
              {workerProfiles.slice(0, 3).map(worker => (
                <WorkerCard key={worker.name} worker={worker} actions={actions} state={state} />
              ))}
            </div>
          </section>
        )}

        {/* GIG WORKER VIEW */}
        {role === 'worker' && (
          <section className="worker-portal-view">
            <div className="worker-stats-cards">
              <div className="stat-card">
                <span className="stat-icon">💰</span>
                <div>
                  <small>Today's Earnings</small>
                  <strong>₹1,450</strong>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">✅</span>
                <div>
                  <small>Completed Jobs</small>
                  <strong>4 Tasks</strong>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">⭐</span>
                <div>
                  <small>Average Rating</small>
                  <strong>4.9 / 5.0</strong>
                </div>
              </div>
            </div>

            <div className="section-heading">
              <h2>Open Gig Requests Near You</h2>
              <span className="radar-status">🟢 Radar Active (3 km radius)</span>
            </div>

            <div className="gig-requests-list">
              <article className="gig-request-card">
                <div className="gig-icon">💧</div>
                <div className="gig-details">
                  <h4>Leaking Bathroom Pipe Repair</h4>
                  <p>📍 Indiranagar 12th Main (1.2 km away) • Posted 5 mins ago</p>
                  <div className="gig-tags">
                    <span>Plumbing</span>
                    <span>Urgent</span>
                    <span>Est Pay: ₹350</span>
                  </div>
                </div>
                <button className="book-button" type="button" onClick={() => actions.showToast('✓ Gig request accepted! Customer notified.')}>
                  Accept Job (₹350)
                </button>
              </article>

              <article className="gig-request-card">
                <div className="gig-icon">⚡</div>
                <div className="gig-details">
                  <h4>Switch Board Replacement &amp; Fuse Check</h4>
                  <p>📍 Koramangala 4th Block (2.5 km away) • Posted 12 mins ago</p>
                  <div className="gig-tags">
                    <span>Electrical</span>
                    <span>Standard</span>
                    <span>Est Pay: ₹400</span>
                  </div>
                </div>
                <button className="book-button" type="button" onClick={() => actions.showToast('✓ Gig request accepted! Customer notified.')}>
                  Accept Job (₹400)
                </button>
              </article>
            </div>
          </section>
        )}

        {/* ADMIN VIEW */}
        {role === 'admin' && (
          <section className="admin-portal-view">
            <div className="admin-stats-cards">
              <div className="stat-card">
                <span className="stat-icon">👥</span>
                <div>
                  <small>Active Workers</small>
                  <strong>1,420 Verified</strong>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">🛡️</span>
                <div>
                  <small>Safety Score</small>
                  <strong>99.4% Compliant</strong>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">⌛</span>
                <div>
                  <small>Pending Verifications</small>
                  <strong>3 Profiles</strong>
                </div>
              </div>
            </div>

            <div className="section-heading">
              <h2>Pending Aadhaar &amp; Skill Verification Queue</h2>
            </div>

            <div className="admin-queue-list">
              <article className="queue-card">
                <div className="queue-avatar">VK</div>
                <div className="queue-info">
                  <h4>Vikram Kulkarni <small>(Aadhaar: 7890 **** 1245)</small></h4>
                  <p>Specialties: Plumbing, Water Pump Repair • 7 Yrs Exp</p>
                  <span className="queue-badge">Aadhaar OTP Verified ✓</span>
                </div>
                <div className="queue-actions">
                  <button className="approve-btn" type="button" onClick={() => actions.showToast('✓ Worker Vikram Kulkarni approved.')}>
                    Approve Worker
                  </button>
                  <button className="reject-btn" type="button" onClick={() => actions.showToast('Worker profile rejected.')}>
                    Reject
                  </button>
                </div>
              </article>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

function PaymentModal({ state, actions }) {
  const { paymentModal } = state;
  if (!paymentModal || !paymentModal.open) return null;

  const worker = paymentModal.worker;
  const visitingFee = paymentModal.visitingFee || 99;
  const safetyFee = paymentModal.safetyFee || 20;
  const discount = paymentModal.discount || 50;
  const payableNow = Math.max(0, visitingFee + safetyFee - discount);

  return (
    <div className="modal-backdrop" onClick={actions.closePaymentModal}>
      <div className="payment-modal-card" onClick={e => e.stopPropagation()}>
        <div className="payment-modal-top">
          <span className="payment-live-badge">⚡ Instant Dispatch &amp; Visiting Fee</span>
          <button type="button" className="modal-close-btn" onClick={actions.closePaymentModal} title="Close">✕</button>
        </div>

        {paymentModal.step === 'payment' && (
          <>
            <h2 className="payment-modal-title">Pay Visiting &amp; Diagnostic Fee</h2>
            <p className="payment-modal-subtitle">
              Adjusted against final repair bill • Guaranteed 15-min arrival in <strong>{state.selectedLocation}</strong>
            </p>

            {/* ASSIGNED WORKER / AUTO-ASSIGN SUMMARY BOX */}
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

            {/* TASK ITEM SUMMARY */}
            <div className="payment-task-summary-row">
              <span className="payment-task-label">Service Request:</span>
              <strong className="payment-task-name">{paymentModal.issue || 'Household Service'}</strong>
            </div>

            {/* VISITING FEE BREAKDOWN BOX */}
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

            {/* PAYMENT METHOD SELECTOR */}
            <div className="payment-method-section">
              <label className="payment-method-label">Select Payment Method:</label>
              <div className="payment-method-grid">
                <button
                  type="button"
                  className={`payment-method-option ${paymentModal.paymentMethod === 'upi' ? 'active' : ''}`}
                  onClick={() => actions.setPaymentMethod('upi')}
                >
                  <span className="method-icon">📱</span>
                  <div className="method-info">
                    <strong>UPI / QR Code</strong>
                    <small>GPay, PhonePe, Paytm</small>
                  </div>
                  {paymentModal.paymentMethod === 'upi' && <span className="method-check">✓</span>}
                </button>

                <button
                  type="button"
                  className={`payment-method-option ${paymentModal.paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => actions.setPaymentMethod('card')}
                >
                  <span className="method-icon">💳</span>
                  <div className="method-info">
                    <strong>Debit / Credit Card</strong>
                    <small>Visa, Mastercard, RuPay</small>
                  </div>
                  {paymentModal.paymentMethod === 'card' && <span className="method-check">✓</span>}
                </button>

                <button
                  type="button"
                  className={`payment-method-option ${paymentModal.paymentMethod === 'netbanking' ? 'active' : ''}`}
                  onClick={() => actions.setPaymentMethod('netbanking')}
                >
                  <span className="method-icon">🏦</span>
                  <div className="method-info">
                    <strong>Net Banking</strong>
                    <small>All Indian Banks</small>
                  </div>
                  {paymentModal.paymentMethod === 'netbanking' && <span className="method-check">✓</span>}
                </button>

                <button
                  type="button"
                  className={`payment-method-option ${paymentModal.paymentMethod === 'cod' ? 'active' : ''}`}
                  onClick={() => actions.setPaymentMethod('cod')}
                >
                  <span className="method-icon">💵</span>
                  <div className="method-info">
                    <strong>Pay After Service</strong>
                    <small>Cash or UPI to worker</small>
                  </div>
                  {paymentModal.paymentMethod === 'cod' && <span className="method-check">✓</span>}
                </button>
              </div>
            </div>

            {/* PAY & DISPATCH ACTION BUTTON */}
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
            <p>Matching with <strong>{worker ? worker.name : 'nearest verified professional'}</strong> near {state.selectedLocation}</p>
            <div className="assigning-progress-bar"><div className="progress-fill" /></div>
          </div>
        )}

        {paymentModal.step === 'success' && (
          <div className="success-dispatch-state">
            <span className="success-dispatch-icon">🎉</span>
            <h3>Worker Auto-Dispatched Successfully!</h3>
            <p><strong>{worker ? worker.name : 'Rohit Kumar'}</strong> is en route to your location.</p>
            <div className="dispatch-eta-pill">
              ⚡ ETA: {worker ? worker.time : 5} mins • OTP Security Code: 4821
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const { state, actions } = useLabouRackApp();
  const screens = {
    login: <LoginScreen state={state} actions={actions} />,
    otp: <OtpScreen state={state} actions={actions} />,
    'customer-registration': <CustomerRegistration state={state} actions={actions} />,
    'worker-registration': <WorkerRegistration state={state} actions={actions} />,
    success: <SuccessScreen state={state} actions={actions} />,
    'worker-pending': <PendingScreen actions={actions} />,
  };
  return (
    <>
      {screens[state.page] || <Dashboard state={state} actions={actions} />}
      <LocationPickerModal state={state} actions={actions} />
      <BookingModal state={state} actions={actions} />
      <PaymentModal state={state} actions={actions} />
      <Toast message={state.toast} />
    </>
  );
}
