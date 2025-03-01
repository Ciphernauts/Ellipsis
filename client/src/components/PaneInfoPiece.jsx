import React from 'react';
import styles from './PaneInfoPiece.module.css';
import { isPWA } from '../utils/isPWA';

export default function PaneInfoPiece({
  name,
  value,
  className,
  // fontSize = isPWA ? 15 : 13,
  fontSize = 13,
}) {
  const isStandalone = isPWA();
  return (
    <div
      className={`${styles.infoPiece} ${className} ${isStandalone ? styles.mobile : ''}`}
    >
      <span className={styles.infoName}>{name}</span>
      <span className={styles.infoValue} style={{ fontSize: `${fontSize}px` }}>
        {value !== undefined && value !== null ? value : 'N/A'}
      </span>
    </div>
  );
}
