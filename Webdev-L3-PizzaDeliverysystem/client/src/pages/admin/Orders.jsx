import { useEffect, useState } from 'react';
import { fetchAllOrders, updateOrderStatus } from '@/api';
import { StatusBadge } from '@/components/StatusBadge';
import '@/styles/admin.css';

const ORDER_STATUSES = ['received', 'in_kitchen', 'out_for_delivery', 'delivered'];

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    const { data, error: err } = await fetchAllOrders();
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    setOrders(data.orders);
  };

  useEffect(() => {
    loadOrders();
    // In a real app we might poll here, but for now manual refresh or initial load is fine
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    const { error: err } = await updateOrderStatus(orderId, newStatus);
    if (err) {
      alert(err);
      return;
    }
    // Update local state to reflect the change immediately
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  if (loading) return <div className="admin-page">Loading orders...</div>;
  if (error) return <div className="admin-page auth-alert auth-alert-error">{error}</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Order Management</h1>
        <p className="text-muted">View all orders and update their fulfillment status.</p>
      </div>

      <div className="admin-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-muted" style={{ textAlign: 'center', padding: '2rem' }}>
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.9em' }}>
                      {order.id.slice(-6).toUpperCase()}
                    </td>
                    <td>
                      <div>{order.user?.name || 'Unknown'}</div>
                      <div className="text-muted" style={{ fontSize: '0.85em' }}>
                        {order.user?.email || 'N/A'}
                      </div>
                    </td>
                    <td style={{ maxWidth: '250px', whiteSpace: 'normal', fontSize: '0.9em' }}>
                      {order.items}
                    </td>
                    <td style={{ fontWeight: '600' }}>${order.total.toFixed(2)}</td>
                    <td>
                      <span className={order.paymentStatus === 'paid' ? 'text-muted' : 'auth-alert-error'}>
                        {order.paymentStatus.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.9em' }}>
                      {new Date(order.placed).toLocaleString(undefined, { 
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                    </td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                    <td>
                      <select
                        className="admin-input"
                        style={{ padding: '4px 8px', width: 'auto' }}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s.replace(/_/g, ' ').toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
