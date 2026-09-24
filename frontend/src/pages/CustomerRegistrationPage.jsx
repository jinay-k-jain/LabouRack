import React from 'react';
import RegistrationShell from '../components/RegistrationShell.jsx';
import OtpInputs from '../components/OtpInputs.jsx';
import { formatPhone } from '../appLogic.js';

export default function CustomerRegistrationPage({ state, actions }) {
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
              <p className="field-note">
                {r.otpSent
                  ? 'OTP dispatched. Enter digits on next screen.'
                  : 'We will send a one-time SMS verification code.'}
              </p>
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
            <button
              className="secondary-button"
              type="button"
              onClick={actions.backCustomerRegistration}
            >
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
