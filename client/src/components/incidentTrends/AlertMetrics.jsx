import React, { useState } from 'react';
import styles from './AlertMetrics.module.css';

export default function AlertMetrics({ data }) {
  const [timeframe, setTimeframe] = useState('24 hours');

  const handleTimeframeChange = (event) => {
    setTimeframe(event.target.value);
  };

  return (
    <div className={`${'dashboardCard'} ${styles.card}`}>
      <div className={styles.header}>
        <h2>Alert Metrics</h2>

        {/* <select
          value={timeframe}
          onChange={handleTimeframeChange}
          className={styles.dropdown}
        >
          <option value='24 hours'>Last 24 Hours</option>
          <option value='7 days'>Last 7 Days</option>
          <option value='30 days'>Last 30 Days</option>
          <option value='12 months'>Last 12 Months</option>
          <option value='Today'>Today</option>
          <option value='This Week'>This Week</option>
          <option value='This Month'>This Month</option>
        </select> */}

        <div className={styles.options}>
          {Object.keys(
            {
              trends: {
                '24 hours': [
                  { name: '6:00 AM', value: 8 },
                  { name: '7:00 AM', value: 12 },
                  { name: '8:00 AM', value: 10 },
                  { name: '9:00 AM', value: 15 },
                  { name: '10:00 AM', value: 9 },
                  { name: '11:00 AM', value: 7 },
                  { name: '12:00 PM', value: 6 },
                  { name: '1:00 PM', value: 10 },
                  { name: '2:00 PM', value: 14 },
                  { name: '3:00 PM', value: 11 },
                  { name: '4:00 PM', value: 9 },
                  { name: '5:00 PM', value: 7 },
                ],
                '7 days': [
                  { name: 'Monday', value: 45 },
                  { name: 'Tuesday', value: 52 },
                  { name: 'Wednesday', value: 39 },
                  { name: 'Thursday', value: 47 },
                  { name: 'Friday', value: 53 },
                  { name: 'Saturday', value: 41 },
                  { name: 'Sunday', value: 45 },
                ],
                '30 days': [
                  { name: '1 Jan', value: 40 },
                  { name: '2 Jan', value: 36 },
                  { name: '3 Jan', value: 45 },
                  { name: '4 Jan', value: 38 },
                  { name: '5 Jan', value: 42 },
                  { name: '6 Jan', value: 39 },
                  { name: '7 Jan', value: 48 },
                  { name: '8 Jan', value: 35 },
                  { name: '9 Jan', value: 41 },
                  { name: '10 Jan', value: 45 },
                ],
                '12 months': [
                  { name: 'Jan', value: 390 },
                  { name: 'Feb', value: 420 },
                  { name: 'Mar', value: 450 },
                  { name: 'Apr', value: 380 },
                  { name: 'May', value: 430 },
                  { name: 'Jun', value: 410 },
                  { name: 'Jul', value: 460 },
                  { name: 'Aug', value: 390 },
                  { name: 'Sep', value: 420 },
                  { name: 'Oct', value: 400 },
                  { name: 'Nov', value: 415 },
                  { name: 'Dec', value: 385 },
                ],
              },
            }.trends
          ).map((option) => (
            <span
              key={option}
              className={`${styles.timeOption} ${
                timeframe === option ? styles.active : ''
              }`}
              onClick={() => setTimeframe(option)}
            >
              Last {option}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.metric}>
          <div className={`${styles.metricValue} ${styles.open}`}>
            {data[timeframe].open}
          </div>
          <div className={styles.metricLabel}>Open</div>
        </div>
        <div className={styles.metric}>
          <div className={`${styles.metricValue} ${styles.resolved}`}>
            {data[timeframe].resolved}
          </div>
          <div className={styles.metricLabel}>Resolved</div>
        </div>
        <div className={styles.metric}>
          <div className={`${styles.metricValue} ${styles.false}`}>
            {data[timeframe].falseAlarm}
          </div>
          <div className={styles.metricLabel}>False Alarm</div>
        </div>
        <div className={styles.metric}>
          <div className={styles.metricValue}>
            {data[timeframe].totalIncidents}
          </div>
          <div className={styles.metricLabel}>Total Incidents</div>
        </div>
        <div className={styles.metric}>
          <div className={`${styles.metricValue} ${styles.constructionSite}`}>
            {data[timeframe].topIncidentConstructionSite}
          </div>
          <div className={styles.metricLabel}>Top Incident Site</div>
        </div>
        <div className={styles.metric}>
          <div className={styles.metricValue}>
            {data[timeframe].criticalIncidents}
          </div>
          <div className={styles.metricLabel}>Critical Incidents</div>
        </div>
        <div className={styles.metric}>
          <div className={styles.metricValue}>
            {data[timeframe].moderateIncidents}
          </div>
          <div className={styles.metricLabel}>Moderate Incidents</div>
        </div>
      </div>
    </div>
  );
}
