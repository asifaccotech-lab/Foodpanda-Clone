import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DarkModeToggle from '../components/DarkModeToggle';
import { ThemeProvider } from '../context/ThemeContext';
import { I18nProvider } from '../context/I18nContext';

test('toggles dark mode class on html element', () => {
  const html = document.documentElement;
  html.classList.remove('dark');

  render(
    <I18nProvider>
      <ThemeProvider>
        <DarkModeToggle />
      </ThemeProvider>
    </I18nProvider>
  );

  const btn = screen.getByRole('button', { name: /Dark mode/i });
  expect(html.classList.contains('dark')).toBe(false);
  fireEvent.click(btn);
  expect(html.classList.contains('dark')).toBe(true);
});