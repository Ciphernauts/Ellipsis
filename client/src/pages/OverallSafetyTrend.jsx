import { useNavigate } from 'react-router-dom';
import OverallGraph from '../components/SafetyTrends/OverallGraph';
import SafetyTrendTable from '../components/SafetyTrends/SafetyTrendTable';
import syncIcon from '../assets/sync_icon.svg';
import styles from './SafetyTrends.module.css';
import ArrowIcon from '../components/icons/ArrowIcon';

const overallSafetyData = {
  displayName: 'Overall Safety Trend',
  data: {
    'currentAverageCompliance': 88,
    '24 hours': [
      { date: '2025-03-01T12:00:00Z', compliance: 78 },
      { date: '2025-03-02T12:00:00Z', compliance: 82 },
      { date: '2025-03-03T12:00:00Z', compliance: 86 },
    ],
    '7 days': [
      { date: '2025-02-23T12:00:00Z', compliance: 74 },
      { date: '2025-02-24T12:00:00Z', compliance: 77 },
      { date: '2025-02-25T12:00:00Z', compliance: 81 },
    ],
    '30 days': [
      { date: '2025-02-01T12:00:00Z', compliance: 70 },
      { date: '2025-02-05T12:00:00Z', compliance: 73 },
      { date: '2025-02-10T12:00:00Z', compliance: 76 },
    ],
    '12 months': [
      { date: '2024-03-01T12:00:00Z', compliance: 65 },
      { date: '2024-06-01T12:00:00Z', compliance: 69 },
      { date: '2024-09-01T12:00:00Z', compliance: 72 },
    ],
  },
  bestMetric: { name: 'Helmet', score: 90 }, // Hardcoded best metric
  worstMetric: { name: 'Scaffolding', score: 65 }, // Hardcoded worst metric
  tableData: [
    {
      'Timestamp': '2024-12-20 10:00 AM',
      'Safety Score': '88.5%',
      'Growth': '0.3% ↑',
      'Alert Count': 2,
    },
    {
      'Timestamp': '2024-12-19 03:45 PM',
      'Safety Score': '87.9%',
      'Growth': '-0.2% ↓',
      'Alert Count': 3,
    },
  ],
};

const OverallSafetyTrend = () => {
  const navigate = useNavigate();
  const lastSync = '2025-03-03 10:15 AM';
  const nextSync = '2025-03-03 10:45 AM';

  return (
    <div className={styles.safetyTrendContainer}>
      <h1>{overallSafetyData.displayName}</h1>

      {/* Navigation Buttons */}
      <div className={styles.navButtons}>
        <button
          className={styles.navButton}
          onClick={() => navigate('/safety-trends/ppe/helmet')}
        >
          View Breakdown
          <ArrowIcon className={styles.rightArrow} />
        </button>
      </div>

      {/* Graph Section */}
      <div className={styles.section}>
        <div className={styles.syncText}>
          <img src={syncIcon} alt='Sync Icon' className={styles.syncIcon} />
          <p>Last synced: {lastSync}</p>
        </div>
        <OverallGraph
          data={overallSafetyData.data}
          bestMetric={overallSafetyData.bestMetric}
          worstMetric={overallSafetyData.worstMetric}
        />
      </div>

      {/* Table Section */}
      <div className={styles.section}>
        <div className={styles.syncText}>
          <img src={syncIcon} alt='Sync Icon' className={styles.syncIcon} />
          <p>Next sync: {nextSync}</p>
        </div>
        <SafetyTrendTable data={overallSafetyData.tableData} />
      </div>
    </div>
  );
};

export default OverallSafetyTrend;
