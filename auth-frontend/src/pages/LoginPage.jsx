import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import { loginUser } from '../api/auth';

function LoginPage({ currentUser, onAuthenticated }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  if (currentUser) {
    return <Navigate to="/success" replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setApiError('');
  }

  function validate() {
    const nextErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = 'Please enter your email address.';
    }

    if (!form.password) {
      nextErrors.password = 'Please enter your password.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    setSubmitting(true);
    setApiError('');

    try {
      const response = await loginUser({
        email: form.email.trim(),
        password: form.password,
      });
      onAuthenticated(response.data);
      navigate('/success', { replace: true });
    } catch (error) {
      setApiError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#102335_0%,#17384f_100%)] px-4 py-10 font-body sm:px-6">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[2rem] border border-white/10 bg-white/10 p-8 text-white shadow-glow backdrop-blur sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-100/70">Returning user</p>
          <h1 className="mt-3 font-display text-5xl leading-tight">Pick up where you left off.</h1>
          <p className="mt-5 text-base leading-8 text-sky-50/85">
            Installed users stay signed in with a secure session cookie, so repeat visits usually open straight into the
            app. If a session expires, sign in with your email and password instead of starting signup again.
          </p>
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/10 p-5">
            <p className="text-sm text-sky-50/70">How the easier flow works</p>
            <ul className="mt-3 space-y-3 text-sm leading-7 text-sky-50/90">
              <li>Signup and verification happen once per account on a device.</li>
              <li>The backend stores a persistent signed-in session for future launches.</li>
              <li>If that session ends, email plus password gets the user back in quickly.</li>
            </ul>
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-8 shadow-glow sm:p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Sign in</p>
            <h2 className="mt-3 font-display text-4xl text-slate-950">Welcome back</h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Use your account email and password. If your session is still valid, the app will restore it
              automatically next time.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <FormInput
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="ava@example.com"
              autoComplete="email"
              error={errors.email}
              required
            />
            <FormInput
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              error={errors.password}
              required
            />

            {apiError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {apiError}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-slate-950 px-5 py-4 text-base font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {submitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            New here?{' '}
            <Link className="font-semibold text-tide hover:text-slate-900" to="/">
              Create an account
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;
