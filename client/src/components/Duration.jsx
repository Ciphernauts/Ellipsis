import styles from './Duration.module.css';

export default function Duration({ hours, minutes, className = '' }) {
  return (
    <div className={`${styles.duration} ${className}`}>
      <div className={styles.hours}>
        <span className={styles.number}>{hours}</span>
        <span>h</span>
      </div>
      <div className={styles.minutes}>
        <span className={styles.number}>{minutes}</span>
        <span>m</span>
      </div>
    </div>
  );
}
