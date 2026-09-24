import React from 'react';

export default function Brand({ compact = false }) {
  return (
    <a className={compact ? 'dashboard-brand' : 'auth-brand'} href="#" onClick={event => event.preventDefault()}>
      <span className="brand-mark" aria-hidden="true">
        <i /><i /><i />
      </span>
      <span className="brand-text">LabouRack</span>
    </a>
  );
}
