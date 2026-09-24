import React from 'react';
import AuthShell from '../components/AuthShell.jsx';

export default function PendingPage({ actions }) {
  return (
    <AuthShell>
      <div className="flow-view success-view">
        <div className="success-icon success-icon--pending">⌛</div>
        <p className="eyebrow">VERIFICATION UNDER REVIEW</p>
        <h1>Profile Submitted Successfully!</h1>
        <p>
          LabouRack operations team is verifying your Aadhaar KYC and skill profile. You will
          receive access once approved.
        </p>
        <button className="primary-button" type="button" onClick={actions.goToLogin}>
          Return to Sign In <span>→</span>
        </button>
      </div>
    </AuthShell>
  );
}
