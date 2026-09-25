import React from 'react';
import AuthShell from '../components/AuthShell.jsx';
import { formatPhone } from '../appLogic.js';

const roleContent = {
  customer: {
    icon: '⌂',
    badge: 'customer-badge',
    title: 'Find Help Nearby',
    copy: 'Book trusted, Aadhaar-verified local professionals for household tasks.',
  },
  worker: {
    icon: '✦',
    badge: 'worker-badge',
    title: 'Turn Skills into Income',
    copy: 'Discover verified gig requests near your location and start earning.',
  },
  admin: {
    icon: '▣',
    badge: 'admin-badge',
    title: 'Platform Operations Center',
    copy: 'Manage worker verifications, security safety audits, and live metrics.',
  },
};

export default function LoginPage({ state, actions }) {
  const { role, phone, admin } = state;
  const detail = roleContent[role];

  return (
    <AuthShell>
      <div className="auth-view">
        <div className="auth-heading">
          <p className="eyebrow">HYPERLOCAL HOME SERVICES</p>
          <h1>Welcome to LabouRack.</h1>
          <p>Select your profile to continue with LabouRack.</p>
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
              <button className="primary-button" type="submit" disabled={state.authLoading}>
                {state.authLoading ? 'Verifying Admin...' : <>Access Admin Portal <span>→</span></>}
              </button>
              <p className="admin-note">Demo Admin Credentials: any non-empty ID and Password (default: admin / admin123).</p>
            </>
          ) : (
            <>
              {/* ── Existing worker: phone + OTP ── */}
              {role === 'worker' && (
                <div style={{
                  background: 'rgba(16,185,129,.06)',
                  border: '1px solid rgba(16,185,129,.18)',
                  borderRadius: 10,
                  padding: '8px 12px',
                  marginBottom: 12,
                  fontSize: 12,
                  color: '#6ee7b7',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                }}>
                  ✦ Already registered? Enter your mobile number to sign in with OTP.
                </div>
              )}

              {/* ── Demo Account Helper Card ── */}
              <div style={{
                marginTop: 12,
                marginBottom: 12,
                padding: '10px 12px',
                background: 'rgba(59, 130, 246, 0.07)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: 10,
                fontSize: 12,
                color: '#93c5fd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
              }}>
                <div>
                  <strong>💡 Registered Demo {role === 'worker' ? 'Worker' : 'Customer'}:</strong>{' '}
                  <span>{role === 'worker' ? '9812345678' : '9876543210'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => actions.setPhone(role === 'worker' ? '9812345678' : '9876543210')}
                  style={{
                    background: '#3b82f6',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '3px 8px',
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Fill Demo
                </button>
              </div>

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
              <button className="primary-button" type="submit" disabled={state.authLoading}>
                {state.authLoading ? 'Connecting to Backend...' : <>Continue with OTP <span>→</span></>}
              </button>

              {/* ── New worker: prominent register card ── */}
              {role === 'worker' ? (
                <div style={{
                  marginTop: 16,
                  padding: '14px 16px',
                  background: 'linear-gradient(135deg, rgba(59,130,246,.08), rgba(16,185,129,.06))',
                  border: '1.5px dashed rgba(59,130,246,.35)',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text, #1a1a1a)', marginBottom: 3 }}>
                      🆕 New to LabouRack?
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--muted, #666)', lineHeight: 1.4 }}>
                      Create a verified worker profile to start accepting local jobs.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={actions.startRegistration}
                    style={{
                      flexShrink: 0,
                      padding: '9px 14px',
                      borderRadius: 10,
                      border: '1.5px solid rgba(59,130,246,.5)',
                      background: 'rgba(59,130,246,.12)',
                      color: '#3b82f6',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Register as Gig Worker →
                  </button>
                </div>
              ) : (
                <p className="signup-line">
                  First time using LabouRack?{' '}
                  <button className="text-button" type="button" onClick={actions.startRegistration}>
                    Create Customer Account
                  </button>
                </p>
              )}
            </>
          )}
        </form>

        <p className="terms">
          By signing in, you agree to our <a href="#terms">Terms of Service</a> &amp;{' '}
          <a href="#privacy">Privacy Guarantee</a>.
        </p>
      </div>
    </AuthShell>
  );
}
