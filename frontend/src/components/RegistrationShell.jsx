import React from 'react';
import AuthShell from './AuthShell.jsx';
import Progress from './Progress.jsx';

export default function RegistrationShell({ worker = false, step, onBack, children }) {
  return (
    <AuthShell>
      <div className="flow-view">
        <button className="back-button" type="button" onClick={onBack}>
          ← <span>Back to sign in</span>
        </button>
        <div className="auth-heading compact">
          <p className="eyebrow">{worker ? 'WORKER ONBOARDING' : 'CUSTOMER SIGNUP'}</p>
          <h1>{worker ? 'Build your verified worker profile.' : 'Create your account in seconds.'}</h1>
          <p>
            {worker
              ? 'Complete identity verification to unlock local job requests in your neighborhood.'
              : 'Get instant access to trusted local plumbers, electricians, and technicians.'}
          </p>
        </div>
        <Progress worker={worker} step={step} />
        {children}
      </div>
    </AuthShell>
  );
}
