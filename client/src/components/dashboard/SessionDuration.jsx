import styles from './SessionDuration.module.css';
import Duration from '../Duration';

export default function SessionDuration({ data }) {
  return (
    <div className={`${'dashboardCard'} ${styles.card}`}>
      <h2>Session Duration</h2>
      <Duration
        hours={data.hours}
        minutes={data.minutes}
        size='large'
        className={styles.duration}
      />
    </div>
  );
}
