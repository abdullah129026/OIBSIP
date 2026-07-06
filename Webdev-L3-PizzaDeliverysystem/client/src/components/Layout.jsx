import { Outlet } from 'react-router-dom';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const Layout = ({ footer = 'A', hero = false }) => (
  <>
    <Navbar />
    <main>
      {hero && <div className="page-hero-spacer" />}
      <Outlet />
    </main>
    <Footer variant={footer} />
  </>
);
