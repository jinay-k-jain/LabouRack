import React from 'react';

export default function Toast({ message }) {
  return message ? (
    <div className="toast" role="status">
      <span className="toast-icon">✨</span>
      {message}
    </div>
  ) : null;
}
