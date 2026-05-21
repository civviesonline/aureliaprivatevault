import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { getSession } from './api/auth';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OtpPage from './pages/OtpPage';
import SuccessPage from './pages/SuccessPage';

function App() {
  const [sessionState, setSessionState] = useState({
    loading: true,
    user: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      try {
        const response = await getSession();
        if (!cancelled) {
          setSessionState({
            loading: false,
            user: response.data,
          });
        }
      } catch {
        if (!cancelled) {
          setSessionState({
            loading: false,
            user: null,
          });
        }
      }
    }

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  if (sessionState.loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-shell px-4 font-body">
        <section className="w-full max-w-xl rounded-[2rem] bg-white p-10 text-center shadow-glow ring-1 ring-slate-200">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Aurelia</p>
          <h1 className="mt-3 font-display text-4xl text-slate-950">Restoring your session</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Checking whether this device already has a valid sign-in so users do not need OTP again on every launch.
          </p>
        </section>
      </main>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<SignupPage currentUser={sessionState.user} />}
      />
      <Route
        path="/login"
        element={<LoginPage currentUser={sessionState.user} onAuthenticated={(user) => setSessionState({ loading: false, user })} />}
      />
      <Route
        path="/verify-otp"
        element={<OtpPage currentUser={sessionState.user} onAuthenticated={(user) => setSessionState({ loading: false, user })} />}
      />
      <Route
        path="/success"
        element={<SuccessPage currentUser={sessionState.user} onLogout={() => setSessionState({ loading: false, user: null })} />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
