import { Routes, Route } from 'react-router-dom';

import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { AdminRoute } from '@/routes/AdminRoute';

import { Landing } from '@/pages/user/Landing';
import { Menu } from '@/pages/user/Menu';
import { About } from '@/pages/user/About';
import { Contact } from '@/pages/user/Contact';
import { Locations } from '@/pages/user/Locations';
import { Cart } from '@/pages/user/Cart';
import { Checkout } from '@/pages/user/Checkout';
import { Register } from '@/pages/user/Register';
import { Login } from '@/pages/user/Login';
import { Verify } from '@/pages/user/Verify';
import { Forgot } from '@/pages/user/Forgot';
import { Reset } from '@/pages/user/Reset';
import { Dashboard } from '@/pages/user/Dashboard';
import { PizzaBuilder } from '@/pages/user/PizzaBuilder';
import { OrderSummary } from '@/pages/user/OrderSummary';
import { AdminLogin } from '@/pages/admin/AdminLogin';
import { Inventory } from '@/pages/admin/Inventory';
import { Orders } from '@/pages/admin/Orders';
import { NotFound } from '@/pages/NotFound';

const App = () => (
  <Routes>
    {/* Landing — Footer A, full-bleed hero under transparent navbar (no spacer) */}
    <Route element={<Layout footer="A" />}>
      <Route path="/" element={<Landing />} />
    </Route>

    {/* Public — Footer A (brand) */}
    <Route element={<Layout footer="A" hero />}>
      <Route path="/cart" element={<Cart />} />
    </Route>

    {/* Public — Footer B (compact) */}
    <Route element={<Layout footer="B" hero />}>
      <Route path="/menu" element={<Menu />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/locations" element={<Locations />} />
    </Route>

    {/* Auth — Footer B, hero spacer for navbar */}
    <Route element={<Layout footer="B" hero />}>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify/:token" element={<Verify />} />
      <Route path="/forgot-password" element={<Forgot />} />
      <Route path="/reset-password/:token" element={<Reset />} />
    </Route>

    {/* Protected user */}
    <Route element={<ProtectedRoute />}>
      <Route element={<Layout footer="A" hero />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/builder" element={<PizzaBuilder />} />
        <Route path="/order-summary" element={<OrderSummary />} />
        <Route path="/checkout" element={<Checkout />} />
      </Route>
    </Route>

    {/* Admin */}
    <Route element={<Layout footer="B" hero />}>
      <Route path="/admin/login" element={<AdminLogin />} />
    </Route>
    <Route element={<AdminRoute />}>
      <Route element={<Layout footer="B" hero />}>
        <Route path="/admin/inventory" element={<Inventory />} />
        <Route path="/admin/orders" element={<Orders />} />
      </Route>
    </Route>

    <Route element={<Layout footer="B" hero />}>
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default App;
