import styles from './Timestamp.module.css';

export default function Timestamp({
  time = '00:00',
  am = true,
  date = 'dd mon',
}) {
  return (
    <div className={styles.timestamp}>
      <span className={styles.fullTime}>
        <span className={styles.time}>{time}</span>
        <span className={styles.amPm}>{am ? 'am' : 'pm'}</span>
      </span>
      <span className={styles.date}>{date}</span>
    </div>
  );
}
