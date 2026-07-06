import '@/styles/auth.css';

export const AuthShell = ({ title, subtitle, children, footer }) => (
  <div className="container auth-page">
    <div className="card auth-card">
      <h1>{title}</h1>
      {subtitle && <p className="auth-subtitle">{subtitle}</p>}
      {children}
      {footer && <div className="auth-foot">{footer}</div>}
    </div>
  </div>
);
