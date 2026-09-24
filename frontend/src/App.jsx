import React, { useState } from 'react';
import { useLabouRackApp } from './appLogic.js';

// Worker dedicated pages
import WorkerAuthPage from './pages/worker/WorkerAuthPage.jsx';
import WorkerHomePage from './pages/worker/WorkerHomePage.jsx';

// Auth & Shared Pages
import LoginPage from './pages/LoginPage.jsx';
import OtpPage from './pages/OtpPage.jsx';
import CustomerRegistrationPage from './pages/CustomerRegistrationPage.jsx';
import SuccessPage from './pages/SuccessPage.jsx';
import PendingPage from './pages/PendingPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import CustomerEstimatePage from './pages/CustomerEstimatePage.jsx';

// Modals & Globals
import LocationPickerModal from './components/modals/LocationPickerModal.jsx';
import BookingModal from './components/modals/BookingModal.jsx';
import PaymentModal from './components/modals/PaymentModal.jsx';
import Toast from './components/Toast.jsx';

// Pages where we stay in the shared auth shell (never jump to worker dashboard)
const SHARED_AUTH_PAGES = ['login', 'otp', 'customer-registration', 'success'];

export default function App() {
  const { state, actions } = useLabouRackApp();

  // Track whether worker just completed registration (so we can show PendingPage)
  const [workerRegDone, setWorkerRegDone] = useState(false);

  // ── 1. Worker REGISTRATION flow ────────────────────────────────────────────
  // Triggered when user clicks "Register as Gig Worker" on the login page.
  // Shows the 5-step registration form — NO login tab.
  if (state.page === 'worker-registration' || workerRegDone) {
    if (workerRegDone) {
      // After registration: show pending-approval screen
      return (
        <PendingPage
          actions={{
            goToLogin: () => {
              setWorkerRegDone(false);
              actions.goToLogin();
            },
          }}
        />
      );
    }
    return (
      <WorkerAuthPage
        mode="register-only"
        onAuthenticated={() => setWorkerRegDone(true)}
        onBack={actions.goToLogin}
      />
    );
  }

  // ── 2. Worker DASHBOARD (already authenticated via main OTP login) ─────────
  // After a worker enters their phone + OTP on the main login page, the shared
  // app state sets role='worker' and navigates away from auth pages.
  // Skip WorkerApp entirely and render WorkerHomePage directly with session data.
  if (
    state.role === 'worker' &&
    !SHARED_AUTH_PAGES.includes(state.page)
  ) {
    return (
      <WorkerHomePage
        worker={{
          name: state.session?.name || 'Gig Worker',
          phone: state.session?.phone,
          selectedCategories: state.session?.skills
            ? []
            : ['electrical', 'plumbing'],
          ...state.session,
        }}
        onSignOut={actions.signOut}
      />
    );
  }

  // ── 3. All other roles: Customer & Admin ───────────────────────────────────
  const screens = {
    login: <LoginPage state={state} actions={actions} />,
    otp: <OtpPage state={state} actions={actions} />,
    'customer-registration': <CustomerRegistrationPage state={state} actions={actions} />,
    success: <SuccessPage state={state} actions={actions} />,
    'estimate-review': (
      <CustomerEstimatePage
        state={state}
        actions={actions}
        onBack={() => actions.setPage('dashboard')}
      />
    ),
  };

  return (
    <>
      {screens[state.page] || <DashboardPage state={state} actions={actions} />}
      <LocationPickerModal state={state} actions={actions} />
      <BookingModal state={state} actions={actions} />
      <PaymentModal state={state} actions={actions} />
      <Toast message={state.toast} />
    </>
  );
}
