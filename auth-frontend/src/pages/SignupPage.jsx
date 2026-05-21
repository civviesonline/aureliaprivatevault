import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import { sendOtp } from '../api/auth';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialForm = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

function SignupPage({ currentUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
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
    const trimmedName = form.fullName.trim();
    const trimmedEmail = form.email.trim();

    if (!trimmedName) {
      nextErrors.fullName = 'Please enter your full name.';
    } else if (trimmedName.length < 2 || trimmedName.length > 100) {
      nextErrors.fullName = 'Full name must be between 2 and 100 characters.';
    }

    if (!trimmedEmail) {
      nextErrors.email = 'Please enter your email address.';
    } else if (!emailPattern.test(trimmedEmail)) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (form.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.';
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password.';
    } else if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = 'Passwords do not match.';
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
      await sendOtp({ email: form.email.trim() });
      navigate('/verify-otp', {
        state: {
          signupData: {
            fullName: form.fullName.trim(),
            email: form.email.trim(),
            password: form.password,
          },
        },
      });
    } catch (error) {
      setApiError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-midnight px-4 py-10 font-body text-slate-900 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative overflow-hidden rounded-[2rem] bg-hero-mesh p-8 shadow-glow ring-1 ring-white/50 sm:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(15,31,48,0.12),transparent_35%)]" />
          <div className="relative space-y-6">
            <span className="inline-flex rounded-full border border-sky-200 bg-white/70 px-4 py-1 text-sm font-semibold text-tide">
              Email OTP verification
            </span>
            <div className="space-y-4">
              <h1 className="max-w-xl font-display text-5xl leading-tight text-slate-950 sm:text-6xl">
                Launch a cleaner signup flow with fast email verification.
              </h1>
              <p className="max-w-lg text-lg leading-8 text-slate-700">
                Users enter their details once, receive a six-digit code by email, and complete registration with a
                verified address before the account is created.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <article className="rounded-3xl border border-white/60 bg-white/70 p-4 backdrop-blur">
                <p className="text-sm font-semibold text-slate-500">Password safety</p>
                <strong className="mt-2 block text-2xl text-slate-900">BCrypt</strong>
              </article>
              <article className="rounded-3xl border border-white/60 bg-white/70 p-4 backdrop-blur">
                <p className="text-sm font-semibold text-slate-500">OTP expiry</p>
                <strong className="mt-2 block text-2xl text-slate-900">5 min</strong>
              </article>
              <article className="rounded-3xl border border-white/60 bg-white/70 p-4 backdrop-blur">
                <p className="text-sm font-semibold text-slate-500">Email delivery</p>
                <strong className="mt-2 block text-2xl text-slate-900">SendGrid</strong>
              </article>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] bg-shell p-8 shadow-glow ring-1 ring-white/50 sm:p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Create account</p>
            <h2 className="mt-3 font-display text-4xl text-slate-950">Start signup</h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              We will send a verification code to your email before we finish registration.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <FormInput
              label="Full name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Ava Thompson"
              autoComplete="name"
              error={errors.fullName}
              minLength={2}
              maxLength={100}
              required
            />
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
              placeholder="Create a secure password"
              autoComplete="new-password"
              error={errors.password}
              minLength={8}
              required
            />
            <FormInput
              label="Confirm password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              error={errors.confirmPassword}
              minLength={8}
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
              {submitting ? 'Sending code...' : 'Continue to verification'}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            Already registered?{' '}
            <Link className="font-semibold text-tide hover:text-slate-900" to="/login">
              Sign in instead
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

export default SignupPage;
