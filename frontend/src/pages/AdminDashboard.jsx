import React, { useEffect, useState } from 'react';
import { AdminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import { toast } from 'react-toastify';

const statuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

export default function AdminDashboard() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    AdminAPI.listOrders().then(setOrders).catch((err) => toast.error(err.message));
  }, []);

  if (!user || user.role !== 'admin') {
    return <p>Admin access required</p>;
  }

  return (
    <>
      <h2>{t('admin.title')}</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
            <th align="left">ID</th>
            <th align="left">{t('admin.status')}</th>
            <th align="left">Total</th>
            <th align="left">{t('admin.update')}</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
              <td>{o.id}</td>
              <td>{o.status}</td>
              <td>${Number(o.totalPrice).toFixed(2)}</td>
              <td>
                <OrderStatusSelect order={o} onUpdated={(u) => {
                  toast.success('Updated');
                  setOrders((prev) => prev.map((x) => (x.id === u.id ? u : x)));
                }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function OrderStatusSelect({ order, onUpdated }) {
  const [status, setStatus] = useState(order.status);

  async function submit() {
    try {
      const updated = await AdminAPI.updateOrderStatus(order.id, status);
      onUpdated(updated);
    } catch (err) {
      // No toast here; parent handles it
    }
  }

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Order status">
        {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <button className="btn primary" onClick={submit}>Save</button>
    </div>
  );
}