import React from 'react';
import AuthShell from '../components/AuthShell.jsx';
import OtpInputs from '../components/OtpInputs.jsx';
import { formatPhone } from '../appLogic.js';

export default function OtpPage({ state, actions }) {
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
