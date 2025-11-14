import React from 'react';
import { useCart } from '../context/CartContext';
import { useI18n } from '../context/I18nContext';
import { OrdersAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function CartPage() {
  const { cart, update, remove } = useCart();
  const { t } = useI18n();
  const navigate = useNavigate();

  const total = Number(cart.total || 0).toFixed(2);

  async function checkout() {
    try {
      const order = await OrdersAPI.create();
      toast.success('Order created');
      navigate(`/tracking/${order.id}`);
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <>
      <h2>{t('cart.title')}</h2>
      {!cart.items?.length ? (
        <p>{t('cart.empty')}</p>
      ) : (
        <>
          <ul aria-label="Cart items" style={{ listStyle: 'none', padding: 0 }}>
            {cart.items.map((it) => (
              <li key={it.id} style={{ display: 'flex', gap: 10, alignItems: 'center', borderBottom: '1px solid var(--color-border)', padding: '.5rem 0' }}>
                <span style={{ flex: 1 }}>{it.name}</span>
                <span>${Number(it.unitPrice).toFixed(2)}</span>
                <label className="sr-only" htmlFor={`qty-${it.id}`}>Quantity</label>
                <input
                  id={`qty-${it.id}`}
                  type="number"
                  min="0"
                  max="99"
                  value={it.quantity}
                  onChange={(e) => update(it.id, Number(e.target.value))}
                  style={{ width: 64 }}
                />
                <strong style={{ width: 80, textAlign: 'right' }}>${Number(it.lineTotal).toFixed(2)}</strong>
                <button className="btn" onClick={() => remove(it.id)} aria-label={`Remove ${it.name}`}>✕</button>
              </li>
            ))}
          </ul>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, alignItems: 'center' }}>
            <strong>Total: ${total}</strong>
            <button className="btn primary" onClick={checkout}>{t('cart.checkout')}</button>
          </div>
        </>
      )}
    </>
  );
}