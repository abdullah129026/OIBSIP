import '@/styles/placeholder.css';

export const Placeholder = ({ title, children }) => (
  <div className="container page-placeholder">
    <h1>{title}</h1>
    <p>{children ?? 'This page is scaffolded. Content arrives in a later build step.'}</p>
  </div>
);
