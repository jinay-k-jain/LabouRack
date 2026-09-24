import React from 'react';

export default function Progress({ worker, step }) {
  const labels = worker
    ? ['Details', 'Verify Mobile', 'Aadhaar KYC', 'Skills & Profile']
    : ['Details', 'Verify Mobile'];
  return (
    <div className="progress-steps" aria-label="Registration steps">
      {labels.map((label, index) => (
        <div
          key={label}
          className={'step ' + (index + 1 < step ? 'done' : index + 1 === step ? 'active' : '')}
        >
          {label}
        </div>
      ))}
    </div>
  );
}
