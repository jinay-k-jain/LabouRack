import React from 'react';
import RegistrationShell from '../components/RegistrationShell.jsx';
import OtpInputs from '../components/OtpInputs.jsx';
import VoiceInputButton from '../components/VoiceInputButton.jsx';
import { formatPhone, workerSkills } from '../appLogic.js';

export default function WorkerRegistrationPage({ state, actions }) {
  const r = state.workerRegistration;
  const { step } = r;

  return (
    <RegistrationShell worker step={step} onBack={actions.goToLogin}>
      <form onSubmit={actions.submitWorkerRegistration} noValidate>
        {/* Step 1 — Basic Details */}
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

        {/* Step 2 — OTP Verification */}
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

        {/* Step 3 — Aadhaar KYC */}
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
              <p className="field-note">
                🔒 Aadhaar numbers are salted, hashed, and never displayed publicly.
              </p>
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

        {/* Step 4 — Skills & Profile */}
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
              <div className="field-label-row">
                <label htmlFor="experience">Work Experience &amp; Description</label>
                <VoiceInputButton onClick={() => actions.showToast('Voice input is coming soon.')} />
              </div>
              <textarea
                className="experience-box"
                id="experience"
                value={r.experience}
                onChange={event => actions.setWorkerExperience(event.target.value)}
                placeholder="Describe your expertise (e.g., 5 years experience in domestic plumbing & pipe repairing)."
              />
            </div>
            <label className="consent-label">
              <input
                type="checkbox"
                checked={r.consented}
                onChange={event => actions.setWorkerConsent(event.target.checked)}
              />
              <span>
                I confirm all shared details are accurate and agree to LabouRack background security
                checks.
              </span>
            </label>
          </>
        )}

        <div className="registration-actions">
          {step > 1 && (
            <button
              className="secondary-button"
              type="button"
              onClick={actions.backWorkerRegistration}
            >
              Back
            </button>
          )}
          <button className="primary-button" type="submit">
            {step === 4
              ? 'Submit Profile for Verification'
              : step === 2
                ? 'Verify Mobile'
                : 'Continue'}{' '}
            <span>→</span>
          </button>
        </div>
      </form>
    </RegistrationShell>
  );
}
