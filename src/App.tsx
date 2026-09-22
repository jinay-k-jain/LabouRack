import { Toast } from './components/Shared';
import { useLabouRackApp } from './hooks/useLabouRackApp';
import { CustomerRegistrationPage, DashboardPage, LoginPage, OtpPage, PendingPage, SuccessPage, WorkerRegistrationPage } from './pages/Pages';

export default function App() {
  const { state, actions } = useLabouRackApp();
  const pages = {
    login: <LoginPage state={state} actions={actions} />,
    otp: <OtpPage state={state} actions={actions} />,
    'customer-registration': <CustomerRegistrationPage state={state} actions={actions} />,
    'worker-registration': <WorkerRegistrationPage state={state} actions={actions} />,
    success: <SuccessPage state={state} actions={actions} />,
    'worker-pending': <PendingPage actions={actions} />,
    dashboard: <DashboardPage state={state} actions={actions} />,
  };

  return <>{pages[state.page]}<Toast message={state.toast} /></>;
}
