import React from 'react';
import styles from './PaneInfoPiece.module.css';

export default function PaneInfoPiece({ name, value }) {
  return (
    <div className={styles.infoPiece}>
      <p className={styles.infoName}>{name}</p>
      <p className={styles.infoValue}>{value}</p>
    </div>
  );
}
