import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import OtpInput from '../components/OtpInput';
import { registerUser, sendOtp, verifyOtp } from '../api/auth';

function OtpPage({ currentUser, onAuthenticated }) {
  const location = useLocation();
  const navigate = useNavigate();
  const signupData = location.state?.signupData;
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(30);

  const maskedEmail = useMemo(() => {
    if (!signupData?.email) {
      return '';
    }

    const [localPart, domain] = signupData.email.split('@');
    if (!domain) {
      return signupData.email;
    }

    const visible = localPart.slice(0, 2);
    return `${visible}${'*'.repeat(Math.max(localPart.length - 2, 2))}@${domain}`;
  }, [signupData?.email]);

  useEffect(() => {
    if (!signupData) {
      navigate('/', { replace: true });
    }
  }, [navigate, signupData]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setSecondsLeft((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [secondsLeft]);

  if (currentUser) {
    return <Navigate to="/success" replace />;
  }

  async function handleVerify(event) {
    event.preventDefault();
    if (!signupData) {
      return;
    }

    if (otp.length !== 6) {
      setError('Enter the full 6-digit code.');
      return;
    }

    setBusy(true);
    setError('');

    try {
      await verifyOtp({ email: signupData.email, otp });
      const registration = await registerUser(signupData);
      onAuthenticated(registration.data);
      navigate('/success', {
        replace: true,
      });
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleResend() {
    if (!signupData || secondsLeft > 0) {
      return;
    }

    setResending(true);
    setError('');

    try {
      await sendOtp({ email: signupData.email });
      setOtp('');
      setSecondsLeft(30);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setResending(false);
    }
  }

  if (!signupData) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#102335_0%,#17384f_100%)] px-4 py-10 font-body sm:px-6">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[2rem] border border-white/10 bg-white/10 p-8 text-white shadow-glow backdrop-blur sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-100/70">Step 2</p>
          <h1 className="mt-3 font-display text-5xl leading-tight">Verify your email</h1>
          <p className="mt-5 text-base leading-8 text-sky-50/85">
            We sent a one-time code to <span className="font-semibold text-white">{maskedEmail}</span>. Enter it below
            to finish account creation.
          </p>
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/10 p-5">
            <p className="text-sm text-sky-50/70">Why this step matters</p>
            <ul className="mt-3 space-y-3 text-sm leading-7 text-sky-50/90">
              <li>Only verified email addresses can complete registration.</li>
              <li>Codes expire quickly and previous codes are invalidated on resend.</li>
              <li>Failed attempts are rate-limited to reduce abuse.</li>
            </ul>
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-8 shadow-glow sm:p-10">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">One-time password</p>
            <h2 className="mt-3 font-display text-4xl text-slate-950">Enter verification code</h2>
            <p className="mt-3 text-base leading-7 text-slate-600">Use the 6-digit code from your inbox.</p>
          </div>

          <form className="space-y-6" onSubmit={handleVerify}>
            <OtpInput value={otp} onChange={setOtp} disabled={busy} />

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            ) : null}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-2xl bg-pine px-5 py-4 text-base font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              {busy ? 'Verifying...' : 'Verify and create account'}
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-4 rounded-3xl bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-700">Need a fresh code?</p>
              <p className="text-sm text-slate-500">
                {secondsLeft > 0 ? `You can resend in ${secondsLeft}s.` : 'Your resend window is open.'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || secondsLeft > 0}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-white disabled:cursor-not-allowed disabled:text-slate-400"
            >
              {resending ? 'Resending...' : 'Resend code'}
            </button>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Need to change your details?{' '}
            <Link className="font-semibold text-tide hover:text-slate-900" to="/">
              Go back to signup
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

export default OtpPage;
