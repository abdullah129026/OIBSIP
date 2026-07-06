import { useEffect, useState } from 'react';
import { fetchInventory, updateInventory } from '@/api';
import { useAuth } from '@/context/AuthContext';
import { validateNonNegativeInt } from '@/utils/validate';
import '@/styles/admin.css';

export const Inventory = () => {
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    const { data, error: err } = await fetchInventory();
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    setInventory(data.inventory);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <div className="admin-page">Loading inventory...</div>;
  if (error) return <div className="admin-page auth-alert auth-alert-error">{error}</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Inventory Dashboard</h1>
        <p className="text-muted">Manage stock and thresholds for all ingredients.</p>
      </div>
      <div className="admin-grid">
        {Object.entries(inventory).map(([type, items]) => (
          <InventoryGroup key={type} type={type} items={items} onUpdate={loadData} />
        ))}
      </div>
    </div>
  );
};

const InventoryGroup = ({ type, items, onUpdate }) => {
  return (
    <div className="admin-card">
      <h2>{type}s</h2>
      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Stock</th>
              <th>Threshold</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <InventoryRow key={item._id} item={item} onUpdate={onUpdate} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const InventoryRow = ({ item, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ stock: item.stock, threshold: item.threshold });
  const [saving, setSaving] = useState(false);

  const isLowStock = item.stock < item.threshold;

  const handleSave = async () => {
    const invalid =
      validateNonNegativeInt(form.stock, 'Stock') ||
      validateNonNegativeInt(form.threshold, 'Threshold');
    if (invalid) {
      alert(invalid);
      return;
    }
    setSaving(true);
    const { error } = await updateInventory(item._id, { 
      stock: Number(form.stock), 
      threshold: Number(form.threshold) 
    });
    setSaving(false);
    if (!error) {
      setIsEditing(false);
      onUpdate();
    } else {
      alert(error);
    }
  };

  if (isEditing) {
    return (
      <tr>
        <td>{item.name}</td>
        <td>
          <input 
            type="number" 
            className="admin-input" 
            value={form.stock} 
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            min="0"
          />
        </td>
        <td>
          <input 
            type="number" 
            className="admin-input" 
            value={form.threshold} 
            onChange={(e) => setForm({ ...form, threshold: e.target.value })}
            min="0"
          />
        </td>
        <td></td>
        <td className="admin-actions">
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button className="btn btn-secondary" onClick={() => setIsEditing(false)} disabled={saving}>
            Cancel
          </button>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td>{item.name}</td>
      <td>{item.stock}</td>
      <td>{item.threshold}</td>
      <td>
        {isLowStock ? <span className="admin-badge-low">Low Stock</span> : <span className="text-muted">OK</span>}
      </td>
      <td>
        <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
          Update
        </button>
      </td>
    </tr>
  );
};
