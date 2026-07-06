import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { resetPassword } from '@/api';
import { AuthShell } from '@/components/AuthShell';

export const Reset = () => {
  const { token } = useParams();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [status, setStatus] = useState({ error: null, success: null });
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ error: null, success: null });
    if (form.password.length < 8) {
      setStatus({ error: 'Password must be at least 8 characters.', success: null });
      return;
    }
    if (form.password !== form.confirm) {
      setStatus({ error: 'Passwords do not match.', success: null });
      return;
    }
    setLoading(true);
    const { data, error } = await resetPassword(token, { password: form.password });
    setLoading(false);
    if (error) {
      setStatus({ error, success: null });
      return;
    }
    setForm({ password: '', confirm: '' });
    setStatus({ error: null, success: data?.message ?? 'Password updated. You can now log in.' });
  };

  return (
    <AuthShell
      title="Reset password"
      subtitle="Choose a new password for your account."
      footer={
        <>
          Back to <Link className="auth-link" to="/login">login</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={onSubmit} noValidate>
        {status.error && <div className="auth-alert auth-alert-error">{status.error}</div>}
        {status.success && <div className="auth-alert auth-alert-success">{status.success}</div>}
        <div className="auth-field">
          <label htmlFor="password">New password</label>
          <input id="password" className="input" type="password" value={form.password} onChange={update('password')} placeholder="At least 8 characters" required />
        </div>
        <div className="auth-field">
          <label htmlFor="confirm">Confirm password</label>
          <input id="confirm" className="input" type="password" value={form.confirm} onChange={update('confirm')} placeholder="Re-enter password" required />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </AuthShell>
  );
};
