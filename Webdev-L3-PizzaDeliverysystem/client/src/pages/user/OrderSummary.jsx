import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getDraft } from '@/utils/draftOrder';
import '@/styles/ordersummary.css';

const DELIVERY = 1.99;

export const OrderSummary = () => {
  const navigate = useNavigate();
  const [draft, setDraft] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = getDraft();
    if (!saved) {
      navigate('/builder', { replace: true });
      return;
    }
    setDraft(saved);
    setReady(true);
  }, [navigate]);

  if (!ready || !draft) return null;

  const { rows, basePrice, itemsTotal } = draft;
  const grandTotal = itemsTotal + DELIVERY;

  return (
    <div className="summary-page">
      <header className="summary-hero">
        <div className="container">
          <p className="summary-eyebrow">Almost there</p>
          <h1 className="summary-heading">Review Your Order</h1>
          <p className="summary-sub text-muted">
            Check your custom pizza before payment. Prices are confirmed at checkout.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container summary-layout">
          <div className="summary-card card">
            <div className="summary-card-head">
              <span className="summary-pizza-emoji">🍕</span>
              <div>
                <h2 className="summary-pizza-name">Your Custom Pizza</h2>
                <p className="text-muted">Freshly built, baked to order</p>
              </div>
            </div>

            <ul className="summary-rows">
              <li className="summary-row">
                <span className="summary-row-label">Signature Base Fee</span>
                <span className="price">${basePrice.toFixed(2)}</span>
              </li>
              {rows.map((r) => (
                <li key={r.label} className="summary-row">
                  <span className="summary-row-label">
                    <span className="summary-row-kind">{r.label}</span>
                    {r.value}
                  </span>
                  <span className="price">
                    {r.price ? `+$${r.price.toFixed(2)}` : 'Free'}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="summary-total card">
            <h3 className="summary-total-title">Order Total</h3>
            <div className="summary-total-row">
              <span className="text-muted">Items</span>
              <span>${itemsTotal.toFixed(2)}</span>
            </div>
            <div className="summary-total-row">
              <span className="text-muted">Delivery</span>
              <span>${DELIVERY.toFixed(2)}</span>
            </div>
            <div className="summary-total-row summary-total-grand">
              <span>Total</span>
              <span className="price">${grandTotal.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary summary-pay" onClick={() => navigate('/checkout')}>
              Proceed to Payment →
            </button>
            <button className="btn btn-secondary summary-edit" onClick={() => navigate('/builder')}>
              Edit Pizza
            </button>
          </aside>
        </div>
      </section>
    </div>
  );
};
