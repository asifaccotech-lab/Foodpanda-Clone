import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import DarkModeToggle from './DarkModeToggle';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useI18n();

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="container" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link to="/" className="brand" aria-label="Food Delivery Home">
          FoodApp
        </Link>
        <div className="nav-actions" role="menubar" aria-label="Navigation menu">
          <Link role="menuitem" to="/">{t('nav.home')}</Link>
          <Link role="menuitem" to="/cart">{t('nav.cart')}</Link>
          {user?.role === 'admin' && <Link role="menuitem" to="/admin">{t('nav.admin')}</Link>}
        </div>
        <div className="nav-actions" style={{ marginLeft: 'auto' }}>
          <LanguageSwitcher />
          <DarkModeToggle />
          {!user ? (
            <>
              <Link to="/login" className="btn" aria-label={t('nav.login')}>{t('nav.login')}</Link>
              <Link to="/register" className="btn" aria-label={t('nav.register')}>{t('nav.register')}</Link>
            </>
          ) : (
            <button className="btn" onClick={logout} aria-label={t('nav.logout')}>
              {t('nav.logout')}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}