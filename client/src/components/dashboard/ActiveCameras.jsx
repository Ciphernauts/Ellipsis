import styles from './ActiveCameras.module.css';

export default function ActiveCameras() {
  const data = { 'active cameras': 2 };

  return (
    <div className={`${'dashboardCard'} ${styles.card}`}>
      <span className={styles.number}>{data['active cameras']}</span>
      <h2>active cameras</h2>
    </div>
  );
}
