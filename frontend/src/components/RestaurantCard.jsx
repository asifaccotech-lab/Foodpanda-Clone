import React from 'react';

export default function RestaurantCard({ restaurant, onClick }) {
  return (
    <button
      className="card"
      onClick={() => onClick?.(restaurant)}
      aria-label={`Open ${restaurant.name}`}
      style={{ textAlign: 'left' }}
    >
      <img src={restaurant.imageUrl} alt={restaurant.name} loading="lazy" />
      <div className="content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <strong>{restaurant.name}</strong>
          <span aria-label={`${restaurant.rating} stars`}>⭐ {restaurant.rating?.toFixed?.(1) ?? restaurant.rating}</span>
        </div>
        <p style={{ margin: '.4rem 0', color: '#666' }}>{restaurant.description}</p>
        <span className="btn secondary" style={{ marginTop: '.5rem' }}>
          ${Number(restaurant.deliveryFee || 0).toFixed(2)} delivery
        </span>
      </div>
    </button>
  );
}