import React, { useState, useEffect } from 'react';
import styles from './Snapshots.module.css'; // Importing CSS Module

export default function Snapshots({ data }) {
  return (
    <div className={`${'dashboardCard'} ${styles.card}`}>
      <h2>Snapshots</h2>
      <div className={styles.images}>
        <img
          src={data[0]?.url}
          alt={data[0]?.metadata.description}
          className={styles.topImage}
        />
        <div className={styles.bottomRow}>
          <img
            src={data[1]?.url}
            alt={data[1]?.metadata.description}
            className={styles.bottomLeftImage}
          />
          <img
            src={data[2]?.url}
            alt={data[2]?.metadata.description}
            className={styles.bottomRightImage}
          />
        </div>
      </div>
    </div>
  );
}
