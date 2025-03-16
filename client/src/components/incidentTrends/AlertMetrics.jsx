import React, { useState } from 'react';
import styles from './AlertMetrics.module.css';

export default function AlertMetrics({ data, className, isPWA = false }) {
  const [timeframe, setTimeframe] = useState('24 hours');

  const handleTimeframeChange = (option) => {
    setTimeframe(option);
  };

  const timeframes = ['24 hours', '7 days', '30 days', '12 months'];

  const metrics = [
    { key: 'open', label: 'Open', className: styles.open },
    { key: 'resolved', label: 'Resolved', className: styles.resolved },
    { key: 'falseAlarm', label: 'False Alarm', className: styles.false },
    { key: 'totalIncidents', label: 'Total Incidents' },
    {
      key: 'topIncidentConstructionSite',
      label: 'Top Incident Site',
      className: styles.constructionSite,
    },
    {
      key: 'criticalIncidents',
      label: 'Critical Incidents',
      className: styles.metricType,
    },
    {
      key: 'moderateIncidents',
      label: 'Moderate Incidents',
      className: styles.metricType,
    },
  ];

  return (
    <div
      className={`${'dashboardCard'} ${styles.card} ${className} ${isPWA ? styles.mobile : ''}`}
    >
      <div className={styles.header}>
        <h2>Alert Metrics</h2>
        <div className={styles.options}>
          {timeframes.map((option) => (
            <span
              key={option}
              className={`${styles.timeOption} ${
                timeframe === option ? styles.active : ''
              }`}
              onClick={() => handleTimeframeChange(option)}
            >
              Last {option}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.content}>
        {isPWA ? (
          <>
            <div className={styles.row}>
              {metrics.slice(0, 3).map((metric) => (
                <div
                  key={metric.key}
                  className={`${styles.metric} ${metric.className || ''}`}
                >
                  <div
                    className={`${styles.metricValue} ${metric.className || ''}`}
                  >
                    {data[timeframe][metric.key] === null ? (
                      <span>No data available</span>
                    ) : (
                      data[timeframe][metric.key]
                    )}
                  </div>
                  <div className={styles.metricLabel}>{metric.label}</div>
                </div>
              ))}
            </div>
            <div className={styles.row}>
              {metrics.slice(3, 5).map((metric) => (
                <div
                  key={metric.key}
                  className={`${styles.metric} ${metric.className || ''}`}
                >
                  <div
                    className={`${styles.metricValue} ${metric.className || ''}`}
                  >
                    {data[timeframe][metric.key] === null ? (
                      <span>No data available</span>
                    ) : (
                      data[timeframe][metric.key]
                    )}
                  </div>
                  <div className={styles.metricLabel}>{metric.label}</div>
                </div>
              ))}
            </div>
            <div className={styles.row}>
              {metrics.slice(5).map((metric) => (
                <div
                  key={metric.key}
                  className={`${styles.metric} ${metric.className || ''}`}
                >
                  <div
                    className={`${styles.metricValue} ${metric.className || ''}`}
                  >
                    {data[timeframe][metric.key] === null ? (
                      <span>No data available</span>
                    ) : (
                      data[timeframe][metric.key]
                    )}
                  </div>
                  <div className={styles.metricLabel}>{metric.label}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          metrics.map((metric) => (
            <div
              key={metric.key}
              className={`${styles.metric} ${metric.className || ''}`}
            >
              <div
                className={`${styles.metricValue} ${metric.className || ''}`}
              >
                {data[timeframe][metric.key] === null ? (
                  <span>Not available</span>
                ) : (
                  data[timeframe][metric.key]
                )}
              </div>
              <div className={styles.metricLabel}>{metric.label}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
