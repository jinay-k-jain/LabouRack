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
          {state.backendOtp && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: 8,
              padding: '8px 12px',
              margin: '12px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 12,
              color: '#10b981',
            }}>
              <span>🔑 Backend Dev OTP: <strong>{state.backendOtp}</strong></span>
              <button
                type="button"
                onClick={() => actions.fillOtp(state.backendOtp)}
                style={{
                  background: '#10b981',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '4px 10px',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Auto-fill
              </button>
            </div>
          )}
          <button className="primary-button" type="submit" disabled={state.authLoading}>
            {state.authLoading ? 'Verifying with Backend...' : <>Verify &amp; Enter Dashboard <span>→</span></>}
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
