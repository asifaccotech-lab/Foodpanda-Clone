import React, { useState } from 'react';
import { useI18n } from '../context/I18nContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function RegisterPage() {
  const { t } = useI18n();
  const { register } = useAuth();
  const [name, setName] = useState('Jane Doe');
  const [email, setEmail] = useState('jane@example.com');
  const [password, setPassword] = useState('password123');
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    try {
      await register({ name, email, password });
      toast.success('Welcome!');
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <>
      <h2>{t('auth.register_title')}</h2>
      <form onSubmit={onSubmit} aria-label="Register form">
        <div className="form-row">
          <label htmlFor="name">{t('auth.name')}</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
        </div>
        <div className="form-row">
          <label htmlFor="email">{t('auth.email')}</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </div>
        <div className="form-row">
          <label htmlFor="password">{t('auth.password')}</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required />
        </div>
        <button className="btn primary" type="submit">{t('auth.submit')}</button>
      </form>
    </>
  );
}