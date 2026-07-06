import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { adminLoginUser } from '@/api';
import { useAuth } from '@/context/AuthContext';
import { AuthShell } from '@/components/AuthShell';
import { validateEmail, validateRequired } from '@/utils/validate';

export const AdminLogin = () => {
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
    const { data, error: err } = await adminLoginUser(form);
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    login(data);
    navigate('/admin/inventory', { replace: true });
  };

  return (
    <AuthShell title="Admin Login" subtitle="Restricted access — staff only.">
      <form className="auth-form" onSubmit={onSubmit} noValidate>
        {error && <div className="auth-alert auth-alert-error">{error}</div>}
        <div className="auth-field">
          <label htmlFor="email">Email</label>
          <input id="email" className="input" type="email" value={form.email} onChange={update('email')} placeholder="admin@pizzacrave.com" required />
        </div>
        <div className="auth-field">
          <label htmlFor="password">Password</label>
          <input id="password" className="input" type="password" value={form.password} onChange={update('password')} placeholder="Your password" required />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>
    </AuthShell>
  );
};
