import styles from './SessionDuration.module.css';
import Duration from '../Duration';

export default function SessionDuration({ data, className, isPWA = false }) {
  return (
    <div
      className={`${'dashboardCard'} ${styles.card} ${className} ${isPWA ? styles.mobile : ''}`}
    >
      <h2>Session Duration</h2>
      <Duration
        hours={data.hours}
        minutes={data.minutes}
        size='large'
        className={styles.duration}
        isPWA={isPWA}
      />
    </div>
  );
}
