import React from 'react';
import styles from './ProgressBar.module.css';

export default function ProgressBar({
  progress = 100,
  width = '100px',
  color = 'var(--primary)',
  className = '',
}) {
  return (
    <div
      className={`${styles.progressBar} ${className}`}
      style={{ width: width }}
    >
      <div
        className={styles.progressBarFill}
        style={{ width: `${progress}%`, backgroundColor: color }}
      ></div>
    </div>
  );
}
