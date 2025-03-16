import React from 'react';
import styles from './Snapshots.module.css';
import DefaultImage from '../../assets/DefaultImage.png';

export default function Snapshots({ data }) {
  return (
    <div className={`${'dashboardCard'} ${styles.card}`}>
      <h2>Snapshots</h2>
      <div className={styles.images}>
        <img
          src={data?.[0]?.url || DefaultImage}
          alt='snapshot 1'
          className={styles.topImage}
        />
        <div className={styles.bottomRow}>
          <img
            src={data?.[1]?.url || DefaultImage}
            alt='snapshot 2'
            className={styles.bottomLeftImage}
          />
          <img
            src={data?.[2]?.url || DefaultImage}
            alt='snapshot 3'
            className={styles.bottomRightImage}
          />
        </div>
      </div>
    </div>
  );
}
