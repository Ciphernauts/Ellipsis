import styles from './Services.module.css';
import HazardIcon from '../icons/HazardIcon';
import ReportIcon from '../icons/ReportIcon';
import BellIcon from '../icons/BellIcon';
import DashboardIcon from '../icons/DashboardIcon';

export default function Services() {
  return (
    <div className={styles.services}>
      <div className={styles.desc}>
        <h1>Services</h1>
        <p>
          Explore the key features of our system designed to enhance safety and
          streamline monitoring at your construction sites.
        </p>
      </div>
      <div className={styles.cards}>
        <div className={styles.service}>
          <div className={styles.iconContainer}>
            <HazardIcon />
          </div>
          <h2>Real-Time Hazard Detection</h2>
          <p>Identify hazards instantly using advanced computer vision.</p>
        </div>
        <div className={styles.service}>
          <div className={styles.iconContainer}>
            <ReportIcon />
          </div>
          <h2>Comprehensive Reporting</h2>
          <p>
            Generate detailed reports with insights on compliance and safety
            performance.
          </p>
        </div>{' '}
        <div className={styles.service}>
          <div className={styles.iconContainer}>
            <BellIcon />
          </div>
          <h2>Instant Alerts</h2>
          <p>
            Receive real-time notifications for potential risks and critical
            hazards.
          </p>
        </div>{' '}
        <div className={styles.service}>
          <div className={styles.iconContainer}>
            <DashboardIcon />
          </div>
          <h2>Intuitive Dashboard</h2>
          <p>
            Monitor safety metrics and compliance trends on a user-friendly
            platform.
          </p>
        </div>
      </div>
    </div>
  );
}
