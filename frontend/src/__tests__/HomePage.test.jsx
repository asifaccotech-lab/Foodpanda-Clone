import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '../pages/HomePage';
import { I18nProvider } from '../context/I18nContext';
import { BrowserRouter } from 'react-router-dom';

test('renders hero text and loading skeletons', () => {
  render(
    <BrowserRouter>
      <I18nProvider>
        <HomePage />
      </I18nProvider>
    </BrowserRouter>
  );
  expect(screen.getByText(/Discover restaurants/i)).toBeInTheDocument();
  // Skeleton placeholders visible initially (container role list with list items)
  const skeletons = screen.getAllByLabelText(/Loading content/i);
  expect(skeletons.length).toBeGreaterThan(0);
});