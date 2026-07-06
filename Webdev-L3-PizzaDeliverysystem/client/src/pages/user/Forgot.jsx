import { useState } from 'react';
import { Link } from 'react-router-dom';

import { forgotPassword } from '@/api';
import { AuthShell } from '@/components/AuthShell';
import { validateEmail } from '@/utils/validate';

export const Forgot = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ error: null, success: null });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const invalid = validateEmail(email);
    if (invalid) {
      setStatus({ error: invalid, success: null });
      return;
    }
    setLoading(true);
    setStatus({ error: null, success: null });
    const { data, error } = await forgotPassword({ email });
    setLoading(false);
    if (error) {
      setStatus({ error, success: null });
      return;
    }
    setStatus({ error: null, success: data?.message ?? 'If an account exists, a reset link has been sent.' });
  };

  return (
    <AuthShell
      title="Forgot password"
      subtitle="Enter your email and we'll send a reset link."
      footer={
        <>
          Remembered it? <Link className="auth-link" to="/login">Back to login</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={onSubmit} noValidate>
        {status.error && <div className="auth-alert auth-alert-error">{status.error}</div>}
        {status.success && <div className="auth-alert auth-alert-success">{status.success}</div>}
        <div className="auth-field">
          <label htmlFor="email">Email</label>
          <input id="email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Sending…' : 'Send reset link'}
        </button>
      </form>
    </AuthShell>
  );
};
