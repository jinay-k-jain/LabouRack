import React from 'react';

export default function OtpInputs({ otp, actions }) {
  return (
    <div className="otp-inputs" aria-label="One-time password">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={node => actions.setOtpInputRef(index, node)}
          value={digit}
          inputMode="numeric"
          maxLength="1"
          aria-label={'Digit ' + (index + 1)}
          autoFocus={index === 0}
          onChange={event => actions.setOtpDigit(index, event.target.value)}
          onKeyDown={event => event.key === 'Backspace' && actions.focusPreviousOtp(index, !digit)}
          onPaste={actions.pasteOtp}
        />
      ))}
    </div>
  );
}
