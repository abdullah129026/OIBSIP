import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { fetchBuilderOptions } from '@/api';
import { StepBuilder } from '@/components/StepBuilder';
import { saveDraft } from '@/utils/draftOrder';
import '@/styles/pizzabuilder.css';

const TYPE_EMOJI = { base: '🍞', sauce: '🥫', cheese: '🧀', veggie: '🥬' };

const STEP_META = [
  { key: 'base', title: 'Base', type: 'single', source: 'base' },
  { key: 'sauce', title: 'Sauce', type: 'single', source: 'sauce' },
  { key: 'cheese', title: 'Cheese', type: 'single', source: 'cheese' },
  { key: 'veggies', title: 'Veggies', type: 'multi', source: 'veggie' },
];

const buildSteps = (options) =>
  STEP_META.map((meta) => ({
    key: meta.key,
    title: meta.title,
    type: meta.type,
    options: (options[meta.source] ?? []).map((o) => ({
      name: o.name,
      emoji: TYPE_EMOJI[meta.source],
      price: o.price,
    })),
  }));

const buildRows = (steps, selection, basePrice) => {
  const rows = steps.map((step) => {
    if (step.type === 'multi') {
      const picked = selection[step.key] ?? [];
      const chosen = step.options.filter((o) => picked.includes(o.name));
      return {
        label: step.title,
        value: chosen.length ? chosen.map((o) => o.name).join(', ') : 'None',
        price: chosen.reduce((s, o) => s + o.price, 0),
      };
    }
    const option = step.options.find((o) => o.name === selection[step.key]);
    return { label: step.title, value: option?.name ?? '', price: option?.price ?? 0 };
  });
  const itemsTotal = basePrice + rows.reduce((s, r) => s + r.price, 0);
  return { rows, itemsTotal };
};

export const PizzaBuilder = () => {
  const navigate = useNavigate();
  const [steps, setSteps] = useState([]);
  const [basePrice, setBasePrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data, error: err } = await fetchBuilderOptions();
      if (!active) return;
      if (err) {
        setError(err);
      } else {
        setSteps(buildSteps(data?.options ?? {}));
        setBasePrice(data?.basePrice ?? 0);
      }
      setLoading(false);
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const handleComplete = ({ selection, total }) => {
    const { rows, itemsTotal } = buildRows(steps, selection, basePrice);
    saveDraft({ selection, rows, basePrice, itemsTotal: total ?? itemsTotal });
    navigate('/order-summary');
  };

  return (
    <div className="builder-page">
      <header className="builder-hero">
        <div className="container">
          <p className="builder-eyebrow">Custom Pizza Builder</p>
          <h1 className="builder-heading">Build Your Perfect Pizza</h1>
          <p className="builder-sub text-muted">
            Four quick steps — pick your base, sauce, cheese, and veggies. Watch the price update live.
          </p>
        </div>
      </header>

      <section className="section builder-section">
        <div className="container">
          {loading ? (
            <div className="card builder-state">
              <p className="text-muted">Loading fresh ingredients…</p>
            </div>
          ) : error ? (
            <div className="card builder-state">
              <p className="text-muted">{error}</p>
            </div>
          ) : (
            <StepBuilder steps={steps} basePrice={basePrice} onComplete={handleComplete} />
          )}
        </div>
      </section>
    </div>
  );
};
