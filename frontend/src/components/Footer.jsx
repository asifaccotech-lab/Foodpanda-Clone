import React from 'react';

export default function Footer() {
  return (
    <footer role="contentinfo">
      <div className="container">
        © {new Date().getFullYear()} FoodApp — Built for demo purposes
      </div>
    </footer>
  );
}