import styles from './ActiveCameras.module.css';

export default function ActiveCameras({ data }) {
  return (
    <div className={`${'dashboardCard'} ${styles.card}`}>
      <span className={styles.number}>{data}</span>
      <h2>active cameras</h2>
    </div>
  );
}
