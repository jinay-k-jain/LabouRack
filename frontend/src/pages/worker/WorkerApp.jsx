import React, { useState } from 'react';
import WorkerAuthPage from './WorkerAuthPage.jsx';
import WorkerHomePage from './WorkerHomePage.jsx';

/**
 * WorkerApp — self-contained worker flow orchestrator.
 * Manages its own auth state independently of the shared app state.
 *
 * States:
 *   'auth'      → shows login / register
 *   'dashboard' → shows the worker home page
 */
export default function WorkerApp({ onExitWorkerMode }) {
  const [workerSession, setWorkerSession] = useState(null); // null = not logged in

  const handleAuthenticated = (workerData) => {
    setWorkerSession(workerData);
  };

  const handleSignOut = () => {
    setWorkerSession(null);
    // Optionally call the parent to fully exit worker mode
    if (onExitWorkerMode) onExitWorkerMode();
  };

  if (!workerSession) {
    return <WorkerAuthPage onAuthenticated={handleAuthenticated} />;
  }

  return <WorkerHomePage worker={workerSession} onSignOut={handleSignOut} />;
}
