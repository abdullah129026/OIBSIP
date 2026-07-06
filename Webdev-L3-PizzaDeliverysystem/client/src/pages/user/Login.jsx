import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { loginUser } from '@/api';
import { useAuth } from '@/context/AuthContext';
import { AuthShell } from '@/components/AuthShell';
import { validateEmail, validateRequired } from '@/utils/validate';

export const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const invalid = validateEmail(form.email) || validateRequired(form.password, 'Password');
    if (invalid) {
      setError(invalid);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: err } = await loginUser(form);
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    login(data);
    navigate(data.user?.role === 'admin' ? '/admin/inventory' : '/dashboard', { replace: true });
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to order your favourite pizza."
      footer={
        <>
          New to PizzaCrave? <Link className="auth-link" to="/register">Create an account</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={onSubmit} noValidate>
        {error && <div className="auth-alert auth-alert-error">{error}</div>}
        <div className="auth-field">
          <label htmlFor="email">Email</label>
          <input id="email" className="input" type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" required />
        </div>
        <div className="auth-field">
          <label htmlFor="password">Password</label>
          <input id="password" className="input" type="password" value={form.password} onChange={update('password')} placeholder="Your password" required />
        </div>
        <div className="auth-row">
          <Link className="auth-link" to="/forgot-password">Forgot password?</Link>
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>
    </AuthShell>
  );
};
