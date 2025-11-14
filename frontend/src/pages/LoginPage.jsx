import React, { useState } from 'react';
import { useI18n } from '../context/I18nContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const { t } = useI18n();
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@foodapp.local');
  const [password, setPassword] = useState('admin123');
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Welcome back');
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <>
      <h2>{t('auth.login_title')}</h2>
      <form onSubmit={onSubmit} aria-label="Login form">
        <div className="form-row">
          <label htmlFor="email">{t('auth.email')}</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </div>
        <div className="form-row">
          <label htmlFor="password">{t('auth.password')}</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </div>
        <button className="btn primary" type="submit">{t('auth.submit')}</button>
      </form>
    </>
  );
}