import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { logoutUser } from '../api/auth';

function SuccessPage({ currentUser, onLogout }) {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const fullName = currentUser?.fullName;
  const email = currentUser?.email;
  const vaultAppUrl = import.meta.env.VITE_VAULT_APP_URL || 'http://localhost:5173';

  if (!fullName || !email) {
    return <Navigate to="/login" replace />;
  }

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await logoutUser();
    } finally {
      onLogout();
      navigate('/login', { replace: true });
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-shell px-4 py-10 font-body sm:px-6">
      <section className="w-full max-w-3xl overflow-hidden rounded-[2rem] bg-white shadow-glow ring-1 ring-slate-200">
        <div className="bg-[linear-gradient(135deg,#0f1f30_0%,#1b4c63_100%)] px-8 py-12 text-white sm:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-100/70">Signed in</p>
          <h1 className="mt-4 font-display text-5xl leading-tight">Welcome, {fullName}.</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-sky-50/85">
            You are signed in on this device, so reopening the installed app can restore your session automatically
            without sending OTP again. A welcome email has been requested for{' '}
            <span className="font-semibold text-white">{email}</span>.
          </p>
        </div>

        <div className="grid gap-6 px-8 py-10 sm:grid-cols-2 sm:px-12">
          <article className="rounded-3xl bg-slate-50 p-6">
            <p className="text-sm font-semibold text-slate-500">What just happened</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">Verification and signup</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Your email passed OTP verification, the password was hashed with BCrypt, and the user record was saved to
              PostgreSQL.
            </p>
          </article>
          <article className="rounded-3xl bg-slate-50 p-6">
            <p className="text-sm font-semibold text-slate-500">Delivery strategy</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">Primary plus fallback</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              OTP delivery uses SendGrid first, with SMTP fallback available when you provide mail settings.
            </p>
          </article>
        </div>

        <div className="border-t border-slate-100 px-8 py-6 sm:px-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              This device will keep the session until the user signs out or the remembered session expires.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={vaultAppUrl}
                className="rounded-2xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Open Private Vault
              </a>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
              >
                {loggingOut ? 'Signing out...' : 'Sign out'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default SuccessPage;
