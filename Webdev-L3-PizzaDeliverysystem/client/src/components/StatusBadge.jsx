import '@/styles/statusbadge.css';

const LABELS = {
  received: 'Received',
  in_kitchen: 'In Kitchen',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
};

export const StatusBadge = ({ status }) => (
  <span className={`badge status-badge status-badge--${status}`}>
    {LABELS[status] ?? status}
  </span>
);
