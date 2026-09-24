import React from 'react';
import AuthShell from '../components/AuthShell.jsx';

export default function SuccessPage({ state, actions }) {
  const firstName = state.session.name ? state.session.name.split(' ')[0] : 'there';
  return (
    <AuthShell>
      <div className="flow-view success-view">
        <div className="success-icon">✓</div>
        <p className="eyebrow">REGISTRATION COMPLETE</p>
        <h1>Welcome, {firstName}!</h1>
        <p>
          Your LabouRack account is ready. Explore nearby verified professionals or manage your
          service requests.
        </p>
        <button className="primary-button" type="button" onClick={actions.continueToDashboard}>
          Launch My Dashboard <span>→</span>
        </button>
      </div>
    </AuthShell>
  );
}
