import SafetyScoreCard from '../components/dashboard/SafetyScoreCard';
import SafetyScoreTrends from '../components/dashboard/SafetyScoreTrends';
import ComplianceBreakdown from '../components/dashboard/ComplianceBreakdown';
import Snapshots from '../components/dashboard/Snapshots';
import SessionDuration from '../components/dashboard/SessionDuration';
import ActiveCameras from '../components/dashboard/ActiveCameras';
import RecentIncidents from '../components/dashboard/RecentIncidents';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <h1>Dashboard</h1>
      <main>
        <div className={styles.row}>
          <SafetyScoreCard />
          <SafetyScoreTrends />
        </div>
        <div className={styles.row}>
          <ComplianceBreakdown />
          <div className={styles.column}>
            <Snapshots />
            <div className={styles.row}>
              <SessionDuration />
              <ActiveCameras />
            </div>
            <RecentIncidents />
          </div>
        </div>
      </main>
    </div>
  );
}
