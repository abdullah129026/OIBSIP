import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';
import { createPaymentOrder, verifyPayment } from '@/api';
import { loadRazorpay } from '@/utils/razorpay';
import { getDraft, clearDraft } from '@/utils/draftOrder';
import '@/styles/checkout.css';

const DELIVERY = 1.99;

const brandColor = () =>
  getComputedStyle(document.documentElement)
    .getPropertyValue('--color-primary')
    .trim() || undefined;

export const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [draft, setDraft] = useState(null);
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

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

  const { selection, rows, basePrice, itemsTotal } = draft;
  const grandTotal = itemsTotal + DELIVERY;

  const handlePay = async () => {
    setError(null);
    setSubmitting(true);

    const loaded = await loadRazorpay();
    if (!loaded) {
      setError('Could not reach the payment gateway. Check your connection and try again.');
      setSubmitting(false);
      return;
    }

    const { data, error: orderError } = await createPaymentOrder(selection);
    if (orderError) {
      setError(orderError);
      setSubmitting(false);
      return;
    }

    const checkout = new window.Razorpay({
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      order_id: data.orderId,
      name: 'PizzaCrave',
      description: 'Custom pizza order',
      prefill: { name: user?.name ?? '', email: user?.email ?? '' },
      theme: { color: brandColor() },
      handler: async (response) => {
        const { error: verifyError } = await verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          selection,
        });
        if (verifyError) {
          setError(verifyError);
          setSubmitting(false);
          return;
        }
        clearDraft();
        navigate('/dashboard', { state: { orderPlaced: true } });
      },
      modal: {
        ondismiss: () => setSubmitting(false),
      },
    });

    checkout.on('payment.failed', () => {
      setError('Payment failed. No charge was made — please try again.');
      setSubmitting(false);
    });

    checkout.open();
  };

  return (
    <div className="checkout-page">
      <header className="checkout-hero">
        <div className="container">
          <p className="checkout-eyebrow">Secure checkout</p>
          <h1 className="checkout-heading">Complete Your Order</h1>
          <p className="checkout-sub text-muted">
            Review your total and pay securely. Prices are confirmed on our server.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container checkout-layout">
          <div className="checkout-details card">
            <h2 className="checkout-card-title">Order Details</h2>
            <ul className="checkout-rows">
              <li className="checkout-row">
                <span className="checkout-row-label">Signature Base Fee</span>
                <span className="price">${basePrice.toFixed(2)}</span>
              </li>
              {rows.map((r) => (
                <li key={r.label} className="checkout-row">
                  <span className="checkout-row-label">
                    <span className="checkout-row-kind">{r.label}</span>
                    {r.value}
                  </span>
                  <span className="price">
                    {r.price ? `+$${r.price.toFixed(2)}` : 'Free'}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="checkout-total card">
            <h3 className="checkout-total-title">Payment Summary</h3>
            <div className="checkout-total-row">
              <span className="text-muted">Items</span>
              <span>${itemsTotal.toFixed(2)}</span>
            </div>
            <div className="checkout-total-row">
              <span className="text-muted">Delivery</span>
              <span>${DELIVERY.toFixed(2)}</span>
            </div>
            <div className="checkout-total-row checkout-total-grand">
              <span>Total</span>
              <span className="price">${grandTotal.toFixed(2)}</span>
            </div>

            {error && <p className="checkout-error">{error}</p>}

            <button
              className="btn btn-primary checkout-pay"
              onClick={handlePay}
              disabled={submitting}
            >
              {submitting ? 'Processing…' : `Pay $${grandTotal.toFixed(2)}`}
            </button>
            <button
              className="btn btn-secondary checkout-back"
              onClick={() => navigate('/order-summary')}
              disabled={submitting}
            >
              Back to Summary
            </button>
            <p className="checkout-note text-muted">
              Test mode — use Razorpay test card 4111 1111 1111 1111.
            </p>
          </aside>
        </div>
      </section>
    </div>
  );
};
