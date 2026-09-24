import React from 'react';
import Brand from './Brand.jsx';

export default function AuthShell({ children }) {
  return (
    <main className="app-shell">
      <section className="auth-panel" aria-live="polite">
        <div className="auth-topbar">
          <Brand />
        </div>
        {children}
      </section>
    </main>
  );
}
