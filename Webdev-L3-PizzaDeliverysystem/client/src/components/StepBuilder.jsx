import { useMemo, useState } from 'react';

import '@/styles/stepbuilder.css';

const isSelected = (selection, step, name) =>
  step.type === 'multi'
    ? (selection[step.key] ?? []).includes(name)
    : selection[step.key] === name;

const priceOf = (selection, steps) =>
  steps.reduce((sum, step) => {
    const picked = selection[step.key];
    if (step.type === 'multi') {
      return (
        sum +
        step.options
          .filter((o) => (picked ?? []).includes(o.name))
          .reduce((s, o) => s + o.price, 0)
      );
    }
    const option = step.options.find((o) => o.name === picked);
    return sum + (option ? option.price : 0);
  }, 0);

export const StepBuilder = ({ steps, basePrice = 0, onComplete }) => {
  const [current, setCurrent] = useState(0);
  const [selection, setSelection] = useState({});

  const step = steps[current];
  const isLast = current === steps.length - 1;
  const total = useMemo(
    () => basePrice + priceOf(selection, steps),
    [basePrice, selection, steps],
  );

  const canAdvance =
    step.type === 'multi' ? true : Boolean(selection[step.key]);

  const toggle = (name) => {
    setSelection((prev) => {
      if (step.type === 'multi') {
        const list = prev[step.key] ?? [];
        const next = list.includes(name)
          ? list.filter((n) => n !== name)
          : [...list, name];
        return { ...prev, [step.key]: next };
      }
      return { ...prev, [step.key]: name };
    });
  };

  const back = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => {
    if (isLast) {
      onComplete?.({ selection, total });
      return;
    }
    setCurrent((c) => Math.min(steps.length - 1, c + 1));
  };

  return (
    <div className="stepbuilder">
      <ol className="stepbuilder-steps">
        {steps.map((s, i) => (
          <li
            key={s.key}
            className={`stepbuilder-step${i === current ? ' active' : ''}${
              i < current ? ' done' : ''
            }`}
          >
            <span className="stepbuilder-step-num">{i < current ? '✓' : i + 1}</span>
            <span className="stepbuilder-step-label">{s.title}</span>
          </li>
        ))}
      </ol>

      <div className="stepbuilder-panel card">
        <header className="stepbuilder-head">
          <h2 className="stepbuilder-title">{step.title}</h2>
          <p className="stepbuilder-hint text-muted">
            {step.type === 'multi'
              ? 'Pick as many as you like.'
              : 'Choose one to continue.'}
          </p>
        </header>

        <div className="stepbuilder-options">
          {step.options.map((o) => {
            const active = isSelected(selection, step, o.name);
            return (
              <button
                key={o.name}
                type="button"
                className={`stepbuilder-option${active ? ' selected' : ''}`}
                onClick={() => toggle(o.name)}
                aria-pressed={active}
              >
                <span className="stepbuilder-option-emoji">{o.emoji}</span>
                <span className="stepbuilder-option-name">{o.name}</span>
                <span className="stepbuilder-option-price price">
                  {o.price ? `+$${o.price.toFixed(2)}` : 'Free'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <footer className="stepbuilder-foot">
        <div className="stepbuilder-total">
          <span className="text-muted">Running total</span>
          <span className="price stepbuilder-total-value">${total.toFixed(2)}</span>
        </div>
        <div className="stepbuilder-actions">
          {current > 0 && (
            <button type="button" className="btn btn-secondary" onClick={back}>
              Back
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary"
            onClick={next}
            disabled={!canAdvance}
          >
            {isLast ? 'Review Order →' : 'Next →'}
          </button>
        </div>
      </footer>
    </div>
  );
};
