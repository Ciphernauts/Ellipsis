import styles from './SessionDuration.module.css';
import Duration from '../Duration';

export default function SessionDuration() {
  const data = {
    duration: {
      hours: 3,
      minutes: 26,
    },
  };
  return (
    <div className={`${'dashboardCard'} ${styles.card}`}>
      <h2>Session Duration</h2>
      <Duration
        hours={data.duration.hours}
        minutes={data.duration.minutes}
        className={styles.duration}
      />
    </div>
  );
}
