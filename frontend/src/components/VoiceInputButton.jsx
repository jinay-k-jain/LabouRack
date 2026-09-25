import React from 'react';

export default function VoiceInputButton({ onClick, className = '' }) {
  return (
    <button
      type="button"
      className={`voice-input-button ${className}`}
      onClick={onClick}
      title="Voice input preview - coming soon"
      aria-label="Speak your description - coming soon"
    >
      <span aria-hidden="true">🎙</span>
    </button>
  );
}
