import React from 'react';
import styles from './PaneInfoPiece.module.css';

export default function PaneInfoPiece({
  name,
  value,
  className,
  fontSize = 13,
}) {
  return (
    <div className={`${styles.infoPiece} ${className}`}>
      <span className={styles.infoName}>{name}</span>
      <span className={styles.infoValue} style={{ fontSize: `${fontSize}px` }}>
        {value}
      </span>
    </div>
  );
}
