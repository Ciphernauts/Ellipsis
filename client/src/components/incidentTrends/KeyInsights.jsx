import React from 'react';
import styles from './KeyInsights.module.css';
import bulletIcon from '../../assets/bulletPoint_icon.svg'; // Import the bullet point icon

export default function KeyInsights({ data }) {
  if (!data) return <div>Loading insights...</div>;

  const { alertMetrics, trendsAndBreakdown } = data;
  const selectedTime = '24 hours'; // Using hardcoded '24 hours' data
  const metrics = alertMetrics[selectedTime];
  const breakdownData = trendsAndBreakdown.breakdown[selectedTime];

  // Extract insights dynamically
  const mostReportedIncident = breakdownData.reduce((prev, curr) =>
    prev.value > curr.value ? prev : curr
  ).name;

  const totalIncidents = metrics.totalIncidents;
  const resolvedPercentage = (
    (metrics.resolved / totalIncidents) *
    100
  ).toFixed(1);
  const criticalIncidents = metrics.criticalIncidents;
  const falseAlarmRate = ((metrics.falseAlarm / totalIncidents) * 100).toFixed(
    1
  );
  const topSite = metrics.topIncidentConstructionSite;

  return (
    <div className={`${'dashboardCard'} ${styles.card}`}>
      <h2>Key Insights</h2>
      <ul className={styles.insightsList}>
        <li>
          <img src={bulletIcon} alt='•' className={styles.bulletIcon} />
          <strong>Most Reported Incident:</strong> {mostReportedIncident}
        </li>
        <li>
          <img src={bulletIcon} alt='•' className={styles.bulletIcon} />
          <strong>Total Incidents:</strong> {totalIncidents} reported
        </li>
        <li>
          <img src={bulletIcon} alt='•' className={styles.bulletIcon} />
          <strong>Resolution Efficiency:</strong> {resolvedPercentage}%
          incidents resolved
        </li>
        <li>
          <img src={bulletIcon} alt='•' className={styles.bulletIcon} />
          <strong>Site with Most Incidents:</strong> {topSite}
        </li>
        <li>
          <img src={bulletIcon} alt='•' className={styles.bulletIcon} />
          <strong>False Alarm Rate:</strong> {falseAlarmRate}%
        </li>
        <li style={{ color: 'red' }}>
          <img src={bulletIcon} alt='•' className={styles.bulletIcon} />
          <strong>Critical Incidents:</strong> {criticalIncidents}
        </li>
      </ul>
    </div>
  );
}
