import React from 'react';
import styles from './KeyInsights.module.css';

export default function KeyInsights({ className, isPWA = false }) {
  return (
    <div
      className={`${'dashboardCard'} ${styles.card} ${className} ${isPWA ? styles.mobile : ''}`}
    >
      <h2>Key Insights</h2>
    </div>
  );
}
