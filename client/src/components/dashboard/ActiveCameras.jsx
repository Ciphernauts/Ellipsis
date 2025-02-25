import styles from './ActiveCameras.module.css';

export default function ActiveCameras({ data, className, isPWA = false }) {
  return (
    <div
      className={`${'dashboardCard'} ${styles.card} ${className} ${isPWA ? styles.mobile : ''}`}
    >
      <span className={styles.number}>{data}</span>
      <h2>active cameras</h2>
    </div>
  );
}
