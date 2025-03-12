import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SafetyTrendGraph from '../components/SafetyTrends/SafetyTrendGraph';
import SafetyTrendTable from '../components/SafetyTrends/SafetyTrendTable';
import syncIcon from '../assets/sync_icon.svg';
import styles from './SafetyTrends.module.css';
import ArrowIcon from '../components/icons/ArrowIcon';
import { capitalizeFirstLetter } from '../utils/helpers';
import axios from 'axios';

const subcategories = [
  'helmet',
  'footwear',
  'vest',
  'gloves',
  'scaffolding',
  'guardrail',
  'harness',
];

const categories = {
  helmet: 'ppe',
  footwear: 'ppe',
  vest: 'ppe',
  gloves: 'ppe',
  scaffolding: 'fall-protection',
  guardrail: 'fall-protection',
  harness: 'fall-protection',
};

const SafetyTrends = ({ isPWA = false }) => {
  const { category, subcategory } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/safety-trends/${subcategory}`
        );
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set placeholder data if the API call fails
        setData({
          currentAvg: 82.25,
          growth: {
            '24 hours': 0,
            '7 days': 0,
            '30 days': 0,
            '12 months': 0,
          },
          maxScore: {
            '24 hours': 85.0,
            '7 days': 88.0,
            '30 days': 90.0,
            '12 months': 92.0,
          },
          minScore: {
            '24 hours': 80.0,
            '7 days': 78.0,
            '30 days': 75.0,
            '12 months': 70.0,
          },
          nextSync: '2025-03-10 10:15 AM',
          trends: {
            '24 hours': [
              { name: '10:00', value: 85.0 },
              { name: '09:00', value: 83.5 },
              { name: '08:00', value: 82.0 },
              { name: '07:00', value: 81.0 },
              { name: '06:00', value: 80.0 },
            ],
            '7 days': [
              { name: '05 Mar', value: 88.0 },
              { name: '04 Mar', value: 86.0 },
              { name: '03 Mar', value: 85.0 },
              { name: '02 Mar', value: 84.0 },
              { name: '01 Mar', value: 83.0 },
            ],
            '30 days': [
              { name: '10 Feb', value: 90.0 },
              { name: '09 Feb', value: 88.0 },
              { name: '08 Feb', value: 87.0 },
              { name: '07 Feb', value: 86.0 },
              { name: '06 Feb', value: 85.0 },
            ],
            '12 months': [
              { name: 'Mar', value: 92.0 },
              { name: 'Feb', value: 90.0 },
              { name: 'Jan', value: 88.0 },
              { name: 'Dec', value: 87.0 },
              { name: 'Nov', value: 86.0 },
            ],
          },
          records: [
            {
              timestamp: '2025-02-02 02:45 PM',
              safetyScore: 84,
              growth: 1,
              alertCount: 1,
            },
            {
              timestamp: '2025-02-02 02:30 PM',
              safetyScore: 90,
              growth: -6,
              alertCount: 1,
            },
            {
              timestamp: '2025-02-02 02:00 PM',
              safetyScore: 83,
              growth: 7,
              alertCount: 1,
            },
            {
              timestamp: '2025-02-02 01:45 PM',
              safetyScore: 89,
              growth: -6,
              alertCount: 1,
            },
            {
              timestamp: '2025-02-02 01:30 PM',
              safetyScore: 75,
              growth: 14,
              alertCount: 2,
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subcategory]);

  if (!data) {
    return <h2>Subcategory not found.</h2>;
  }

  const subcategoryDisplayName = capitalizeFirstLetter(subcategory) + ' Safety';

  const prevSubcategory =
    subcategories[
      (subcategories.indexOf(subcategory) - 1 + subcategories.length) %
        subcategories.length
    ];

  const nextSubcategory =
    subcategories[
      (subcategories.indexOf(subcategory) + 1) % subcategories.length
    ];

  if (loading) return <div>Loading...</div>;

  return (
    <div
      className={`${styles.safetyTrendContainer} ${isPWA ? styles.mobile : ''}`}
    >
      <h1>
        {{ 'ppe': 'PPE', 'fall-protection': 'Fall Protection' }[category]} :{' '}
        {subcategoryDisplayName}
      </h1>

      <div className={styles.navButtons}>
        {subcategory !== 'helmet' ? (
          <button
            className={styles.navButton}
            onClick={() =>
              navigate(
                `/safety-trends/${categories[prevSubcategory]}/${prevSubcategory}`
              )
            }
          >
            <ArrowIcon className={styles.leftArrow} />
            Back to {prevSubcategory}
          </button>
        ) : (
          <button
            className={styles.navButton}
            onClick={() => navigate(`/safety-trends/overall`)}
          >
            <ArrowIcon className={styles.leftArrow} />
            Back to overall
          </button>
        )}
        <button
          className={styles.navButton}
          onClick={() =>
            navigate(
              `/safety-trends/${categories[nextSubcategory]}/${nextSubcategory}`
            )
          }
        >
          View {nextSubcategory}
          <ArrowIcon className={styles.rightArrow} />
        </button>
      </div>

      <div className={styles.section}>
        <SafetyTrendGraph data={data} isPWA={isPWA} />
      </div>

      <div className={styles.section}>
        <div className={`${styles.syncText} ${styles.tableSyncText}`}>
          <img src={syncIcon} alt='Sync Icon' className={styles.syncIcon} />
          <p>Next sync: {data.nextSync}</p>
        </div>
        <SafetyTrendTable data={data.records} isPWA={isPWA} />
      </div>
    </div>
  );
};

export default SafetyTrends;
