import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { fetchMyOrders, fetchPizzas } from '@/api';
import { PizzaCard } from '@/components/PizzaCard';
import { StatusBadge } from '@/components/StatusBadge';
import '@/styles/dashboard.css';

const ORDER_POLL_MS = 5000;

const formatPlaced = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const shortId = (id) => `PZ-${String(id).slice(-6).toUpperCase()}`;

export const Dashboard = () => {
  const navigate = useNavigate();
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data, error: err } = await fetchPizzas();
      if (!active) return;
      if (err) setError(err);
      else setPizzas(data?.pizzas ?? []);
      setLoading(false);
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const poll = async () => {
      const { data, error: err } = await fetchMyOrders();
      if (!active) return;
      if (err) setOrdersError(err);
      else {
        setOrders(data?.orders ?? []);
        setOrdersError(null);
      }
      setOrdersLoading(false);
    };
    poll();
    const timer = setInterval(poll, ORDER_POLL_MS);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="dashboard-page">
      <header className="dashboard-hero">
        <div className="container">
          <div className="dashboard-hero-inner">
            <div>
              <p className="dashboard-eyebrow">Welcome back 👋</p>
              <h1 className="dashboard-heading">Your Dashboard</h1>
              <p className="dashboard-sub text-muted">
                Order a favourite in one tap, or craft your own from scratch.
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/builder')}>
              Build Your Own →
            </button>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="dashboard-section-head">
            <h2 className="dashboard-section-title">Active Orders</h2>
            <span className="text-muted">Live status · refreshes automatically</span>
          </div>

          {ordersLoading ? (
            <div className="dashboard-empty card">
              <p className="text-muted">Loading your orders…</p>
            </div>
          ) : ordersError ? (
            <div className="dashboard-empty card">
              <p className="text-muted">{ordersError}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="dashboard-empty card">
              <p className="text-muted">No orders yet. Your next pizza is one tap away.</p>
              <button className="btn btn-primary" onClick={() => navigate('/builder')}>
                Start an Order
              </button>
            </div>
          ) : (
            <div className="dashboard-orders">
              {orders.map((o) => (
                <article key={o.id} className="dashboard-order card">
                  <div className="dashboard-order-main">
                    <span className="dashboard-order-id">{shortId(o.id)}</span>
                    <span className="dashboard-order-items">{o.items}</span>
                    <span className="text-muted dashboard-order-placed">{formatPlaced(o.placed)}</span>
                  </div>
                  <div className="dashboard-order-side">
                    <StatusBadge status={o.status} />
                    <span className="price dashboard-order-total">${o.total.toFixed(2)}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section dashboard-menu-section">
        <div className="container">
          <div className="dashboard-section-head">
            <h2 className="dashboard-section-title">Order Again</h2>
            <span className="text-muted">Handcrafted favourites, ready in minutes</span>
          </div>
          {loading ? (
            <div className="dashboard-empty card">
              <p className="text-muted">Loading pizzas…</p>
            </div>
          ) : error ? (
            <div className="dashboard-empty card">
              <p className="text-muted">{error}</p>
            </div>
          ) : pizzas.length === 0 ? (
            <div className="dashboard-empty card">
              <p className="text-muted">No pizzas available right now. Build your own instead.</p>
              <button className="btn btn-primary" onClick={() => navigate('/builder')}>
                Build Your Own
              </button>
            </div>
          ) : (
            <div className="dashboard-grid">
              {pizzas.map((p) => (
                <PizzaCard
                  key={p.id}
                  name={p.name}
                  image={p.image}
                  description={p.description}
                  price={p.price.toFixed(2)}
                  onOrder={() => navigate('/builder')}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
