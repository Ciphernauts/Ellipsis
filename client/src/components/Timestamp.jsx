import styles from './Timestamp.module.css';

export default function Timestamp({
  time = '00:00',
  am = true,
  date = 'dd mon',
  isPWA = false,
}) {
  return (
    <div className={`${styles.timestamp} ${isPWA ? styles.mobile : ''}`}>
      <span className={styles.fullTime}>
        <span className={styles.time}>{time}</span>
        <span className={styles.amPm}>{am ? 'am' : 'pm'}</span>
      </span>
      <span className={styles.date}>{date}</span>
    </div>
  );
}
