import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RestaurantAPI } from '../services/api';
import RestaurantCard from '../components/RestaurantCard';
import SkeletonCard from '../components/SkeletonCard';
import { useI18n } from '../context/I18nContext';

export default function HomePage() {
  const { t } = useI18n();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    RestaurantAPI.list({ search })
      .then((res) => mounted && setRestaurants(res.items || []))
      .catch(() => mounted && setRestaurants([]))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [search]);

  return (
    <>
      <section className="hero" aria-label="Intro">
        <div className="container">
          <h1>{t('home.title')}</h1>
          <p>{t('home.subtitle')}</p>
        </div>
      </section>

      <div className="form-row">
        <label htmlFor="search" className="sr-only">Search</label>
        <input
          id="search"
          type="search"
          placeholder="Search restaurants..."
          aria-label="Search restaurants"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid" role="list">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : restaurants.map((r) => (
              <div role="listitem" key={r.id}>
                <RestaurantCard restaurant={r} onClick={(rest) => navigate(`/restaurant/${rest.id}`)} />
              </div>
            ))}
      </div>
    </>
  );
}