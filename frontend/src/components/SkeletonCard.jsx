import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="card" aria-busy="true" aria-label="Loading content">
      <div className="skeleton thumb" />
      <div className="content">
        <div className="skeleton line" style={{ width: '60%', marginBottom: 8 }} />
        <div className="skeleton line" style={{ width: '90%', marginBottom: 8 }} />
        <div className="skeleton line" style={{ width: '40%', marginBottom: 8 }} />
      </div>
    </div>
  );
}