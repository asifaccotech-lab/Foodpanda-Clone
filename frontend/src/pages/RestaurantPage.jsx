import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RestaurantAPI } from '../services/api';
import { useI18n } from '../context/I18nContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import SkeletonCard from '../components/SkeletonCard';
import { toast } from 'react-toastify';

export default function RestaurantPage() {
  const { t } = useI18n();
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const { add } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    RestaurantAPI.get(id)
      .then((res) => mounted && setRestaurant(res))
      .catch(() => mounted && setRestaurant(null))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [id]);

  if (loading) {
    return <SkeletonCard />;
  }
  if (!restaurant) {
    return <p>{t('restaurant.loading')}</p>;
  }

  return (
    <>
      <header style={{ marginBottom: '1rem' }}>
        <img src={restaurant.imageUrl} alt={restaurant.name} loading="lazy" style={{ width: '100%', height: 240, objectFit: 'cover', borderRadius: 12 }} />
        <h2>{restaurant.name}</h2>
        <p>{restaurant.description}</p>
        <div style={{ display: 'flex', gap: '.5rem' }}>
          <span className="btn">⭐ {restaurant.rating?.toFixed?.(1) ?? restaurant.rating}</span>
          <span className="btn secondary">${Number(restaurant.deliveryFee || 0).toFixed(2)} delivery</span>
        </div>
      </header>

      <h3>{t('restaurant.menu')}</h3>
      <MenuList restaurantId={restaurant.id} onAdd={(menuId) => {
        if (!user) {
          toast.error('Please log in to add to cart');
          return;
        }
        add(menuId, 1);
      }} />
    </>
  );
}

function MenuList({ restaurantId, onAdd }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    RestaurantAPI.menu(restaurantId)
      .then((res) => mounted && setItems(res || []))
      .catch(() => mounted && setItems([]))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [restaurantId]);

  if (loading) {
    return (
      <div className="grid">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  return (
    <div className="grid" role="list">
      {items.map((it) => (
        <div role="listitem" key={it.id} className="card">
          <img src={it.imageUrl} alt={it.name} loading="lazy" />
          <div className="content">
            <strong>{it.name}</strong>
            {it.Category?.name && <span style={{ marginLeft: 6, color: '#888' }}>· {it.Category.name}</span>}
            <p style={{ margin: '.4rem 0', color: '#666' }}>{it.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>${Number(it.price).toFixed(2)}</span>
              <button className="btn primary" onClick={() => onAdd(it.id)} aria-label={`Add ${it.name} to cart`}>Add</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}