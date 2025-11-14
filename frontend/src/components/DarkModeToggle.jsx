import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';

export default function DarkModeToggle() {
  const { theme, toggle } = useTheme();
  const { t } = useI18n();

  return (
    <button
      className="btn"
      aria-pressed={theme === 'dark'}
      aria-label={t('common.dark_mode')}
      onClick={toggle}
    >
      {theme === 'dark' ? '🌙' : '☀️'} {t('common.dark_mode')}
    </button>
  );
}