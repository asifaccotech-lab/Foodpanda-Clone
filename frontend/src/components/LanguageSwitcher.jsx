import React from 'react';
import { useI18n } from '../context/I18nContext';

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();

  return (
    <label aria-label={t('common.language')}>
      <span style={{ marginRight: 8 }}>{t('common.language')}:</span>
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        aria-controls="root"
      >
        <option value="en">EN</option>
        <option value="es">ES</option>
      </select>
    </label>
  );
}