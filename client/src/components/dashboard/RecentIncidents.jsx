import Timestamp from '../Timestamp';
import styles from './RecentIncidents.module.css';

export default function RecentIncidents() {
  const data = {
    incidents: [
      {
        timestamp: '2024-12-30T17:39:00',
        name: 'Improper Scaffolding',
        severity: 'Medium',
      },
      {
        timestamp: '2024-12-30T17:31:00',
        name: 'Missing Vest',
        severity: 'Medium',
      },
      {
        timestamp: '2024-12-30T17:18:00',
        name: 'Scaffold overturning',
        severity: 'High',
      },
    ],
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const time = `${date.getHours() % 12 || 12}:${date.getMinutes().toString().padStart(2, '0')}`;
    const am = date.getHours() < 12;
    const dateFormatted = `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;

    return { time, am, dateFormatted };
  };

  return (
    <div className={`${'dashboardCard'} ${styles.card}`}>
      <h2>Recent Incidents</h2>
      <div className={styles.incidents}>
        {data.incidents.map((incident, index) => {
          const { time, am, dateFormatted } = formatTimestamp(
            incident.timestamp
          );

          return (
            <div
              key={index}
              className={`${styles.incident} ${incident.severity === 'High' ? styles.critical : ''}`}
            >
              <Timestamp time={time} am={am} date={dateFormatted} />
              <span className={styles.bullet}></span>
              <div className={styles.desc}>
                <p className={styles.name}>{incident.name}</p>
                <p className={styles.severity}>Severity: {incident.severity}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
