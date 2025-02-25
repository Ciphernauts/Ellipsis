import styles from './Duration.module.css';

export default function Duration({
  hours,
  minutes,
  seconds,
  size = 'small',
  className = '',
  isPWA = false,
}) {
  return (
    <div
      className={`${styles.duration} ${className} ${styles[size]} ${isPWA ? styles.mobile : ''}`}
    >
      <div className={styles.hours}>
        <span className={styles.number}>{hours}</span>
        <span>h</span>
      </div>
      <div className={styles.minutes}>
        <span className={styles.number}>{minutes}</span>
        <span>m</span>
      </div>
      {size === 'small' && (
        <div className={styles.seconds}>
          <span className={styles.number}>{seconds}</span>
          <span>s</span>
        </div>
      )}
    </div>
  );
}
