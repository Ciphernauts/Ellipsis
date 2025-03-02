import React, { useEffect } from 'react';
import Timestamp from '../Timestamp';
import styles from './RecentIncidents.module.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { formatDate } from '../../utils/helpers';

export default function RecentIncidents({ data, className, isPWA = false }) {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const time = `${date.getHours() % 12 || 12}:${date.getMinutes().toString().padStart(2, '0')}`;
    const am = date.getHours() < 12;
    const dateFormatted = formatDate(timestamp, 'veryshort');
    return { time, am, dateFormatted };
  };

  // Slick carousel settings
  const carouselSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div
      className={`${'dashboardCard'} ${styles.card} ${className} ${isPWA ? styles.mobile : ''}`}
    >
      <h2>Recent Incidents</h2>
      <div className={styles.incidents}>
        {isPWA ? (
          // Render as a carousel for PWA
          <Slider {...carouselSettings}>
            {data.map((incident, index) => {
              const { time, am, dateFormatted } = formatTimestamp(
                incident.timestamp
              );

              return (
                <div className={styles.incidentContainer}>
                  <div
                    key={index}
                    className={`${styles.incident} ${incident.severity === 'High' ? styles.critical : ''}`}
                  >
                    <Timestamp
                      time={time}
                      am={am}
                      date={dateFormatted}
                      isPWA={isPWA}
                    />
                    {!isPWA && <span className={styles.bullet}></span>}
                    <div className={styles.desc}>
                      <p className={styles.name}>{incident.name}</p>
                      <p className={styles.severity}>
                        Severity: {incident.severity}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
        ) : (
          // Render as a list for desktop
          data.map((incident, index) => {
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
                  <p className={styles.severity}>
                    Severity: {incident.severity}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
