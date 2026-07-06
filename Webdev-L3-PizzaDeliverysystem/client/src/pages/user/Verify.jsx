import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { verifyEmail } from '@/api';
import { AuthShell } from '@/components/AuthShell';

export const Verify = () => {
  const { token } = useParams();
  const [state, setState] = useState({ loading: true, error: null, message: null });
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const run = async () => {
      const { data, error } = await verifyEmail(token);
      if (error) {
        setState({ loading: false, error, message: null });
        return;
      }
      setState({ loading: false, error: null, message: data?.message ?? 'Email verified. You can now log in.' });
    };
    run();
  }, [token]);

  return (
    <AuthShell
      title="Verify your email"
      footer={
        !state.loading && (
          <>
            {state.error ? 'Need a new link? ' : 'Ready? '}
            <Link className="auth-link" to={state.error ? '/register' : '/login'}>
              {state.error ? 'Register again' : 'Go to login'}
            </Link>
          </>
        )
      }
    >
      {state.loading && <p className="auth-subtitle">Verifying your email…</p>}
      {state.error && <div className="auth-alert auth-alert-error">{state.error}</div>}
      {state.message && <div className="auth-alert auth-alert-success">{state.message}</div>}
    </AuthShell>
  );
};
