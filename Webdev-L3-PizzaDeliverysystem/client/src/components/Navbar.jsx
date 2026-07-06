import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

import '@/styles/navbar.css';

const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'Menu', to: '/menu' },
  { label: 'Locations', to: '/locations' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          PizzaCrave
        </Link>

        <nav className={`navbar-pill ${open ? 'open' : ''}`}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar-actions">
          <button className="navbar-circle" aria-label="Search">
            ⌕
          </button>
          <Link to="/login" className="navbar-circle" aria-label="Account">
            ☺
          </Link>
          <button
            className="navbar-circle navbar-toggle"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            ≡
          </button>
        </div>
      </div>
    </header>
  );
};
