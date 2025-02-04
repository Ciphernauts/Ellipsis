import SafetyScoreCard from '../components/dashboard/SafetyScoreCard';
import SafetyScoreTrends from '../components/dashboard/SafetyScoreTrends';
import ComplianceBreakdown from '../components/dashboard/ComplianceBreakdown';
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
        <div>
          <ComplianceBreakdown />
        </div>
      </main>
    </div>
  );
}
