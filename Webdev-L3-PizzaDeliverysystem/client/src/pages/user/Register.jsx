import { useState } from 'react';
import { Link } from 'react-router-dom';

import { registerUser } from '@/api';
import { AuthShell } from '@/components/AuthShell';
import { validateRequired, validateEmail, validatePassword } from '@/utils/validate';

export const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState({ error: null, success: null });
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const invalid =
      validateRequired(form.name, 'Full name') ||
      validateEmail(form.email) ||
      validatePassword(form.password);
    if (invalid) {
      setStatus({ error: invalid, success: null });
      return;
    }
    setLoading(true);
    setStatus({ error: null, success: null });
    const { data, error } = await registerUser(form);
    setLoading(false);
    if (error) {
      setStatus({ error, success: null });
      return;
    }
    setForm({ name: '', email: '', password: '' });
    setStatus({ error: null, success: data?.message ?? 'Account created. Check your email to verify.' });
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join PizzaCrave and start building your perfect pizza."
      footer={
        <>
          Already have an account? <Link className="auth-link" to="/login">Log in</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={onSubmit} noValidate>
        {status.error && <div className="auth-alert auth-alert-error">{status.error}</div>}
        {status.success && <div className="auth-alert auth-alert-success">{status.success}</div>}
        <div className="auth-field">
          <label htmlFor="name">Full name</label>
          <input id="name" className="input" type="text" value={form.name} onChange={update('name')} placeholder="Jane Doe" required />
        </div>
        <div className="auth-field">
          <label htmlFor="email">Email</label>
          <input id="email" className="input" type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" required />
        </div>
        <div className="auth-field">
          <label htmlFor="password">Password</label>
          <input id="password" className="input" type="password" value={form.password} onChange={update('password')} placeholder="At least 8 characters" required />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthShell>
  );
};
