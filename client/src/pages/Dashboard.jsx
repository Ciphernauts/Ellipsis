import { useState, useEffect } from 'react';
import SafetyScoreCard from '../components/dashboard/SafetyScoreCard';
import SafetyScoreTrends from '../components/dashboard/SafetyScoreTrends';
import ComplianceBreakdown from '../components/dashboard/ComplianceBreakdown';
import Snapshots from '../components/dashboard/Snapshots';
import SessionDuration from '../components/dashboard/SessionDuration';
import ActiveCameras from '../components/dashboard/ActiveCameras';
import RecentIncidents from '../components/dashboard/RecentIncidents';
import styles from './Dashboard.module.css';
import axios from 'axios';

export default function Dashboard({ isPWA = false }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/dashboard');
        if (response.data) {
          setData(response.data);
        } else {
          throw new Error('No data returned from API');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set placeholder data in case of an error
        setData({
          safetyscore: {
            ppe: {
              helmet: 97.3,
              vest: 74.9,
              footwear: 86.9,
              gloves: 94.7,
            },
            fall: {
              scaffolding: 77.0,
              guardrails: 51.8,
              harness: 87.5,
            },
          },
          trends: {
            chart: {
              '24 hours': [
                { time: '6:00 AM', value: 85.2 },
                { time: '7:00 AM', value: 87.1 },
                { time: '8:00 AM', value: 86.4 },
                { time: '9:00 AM', value: 88.3 },
                { time: '10:00 AM', value: 85.9 },
                { time: '1:00 PM', value: 86.5 },
                { time: '2:00 PM', value: 87.4 },
                { time: '3:00 PM', value: 86.8 },
                { time: '4:00 PM', value: 87.0 },
                { time: '5:00 PM', value: 89.3 },
                { time: '7:00 PM', value: 86.9 },
              ],
              '7 days': [
                { time: 'Mon', value: 85.2 },
                { time: 'Tue', value: 87.1 },
                { time: 'Wed', value: 86.4 },
                { time: 'Thu', value: 88.3 },
                { time: 'Fri', value: 85.9 },
                { time: 'Sat', value: 86.7 },
                { time: 'Sun', value: 87.7 },
              ],
              '30 days': [
                { time: '1 Jan', value: 85.4 },
                { time: '2 Jan', value: 86.1 },
                { time: '3 Jan', value: 85.9 },
                { time: '4 Jan', value: 87.2 },
                { time: '5 Jan', value: 86.5 },
                { time: '6 Jan', value: 88.0 },
                { time: '7 Jan', value: 85.8 },
                { time: '8 Jan', value: 86.9 },
                { time: '9 Jan', value: 87.4 },
                { time: '10 Jan', value: 85.6 },
                { time: '11 Jan', value: 86.3 },
                { time: '12 Jan', value: 87.8 },
                { time: '13 Jan', value: 86.7 },
                { time: '14 Jan', value: 85.5 },
                { time: '15 Jan', value: 87.0 },
                { time: '16 Jan', value: 86.2 },
                { time: '17 Jan', value: 88.1 },
                { time: '18 Jan', value: 86.8 },
                { time: '19 Jan', value: 87.3 },
                { time: '20 Jan', value: 85.7 },
                { time: '21 Jan', value: 86.9 },
                { time: '22 Jan', value: 87.5 },
                { time: '23 Jan', value: 85.8 },
                { time: '24 Jan', value: 86.4 },
                { time: '25 Jan', value: 87.2 },
                { time: '26 Jan', value: 86.0 },
                { time: '27 Jan', value: 88.2 },
                { time: '28 Jan', value: 85.9 },
                { time: '29 Jan', value: 86.7 },
                { time: '30 Jan', value: 87.1 },
              ],
              '12 months': [
                { time: 'Jan', value: 85.9 },
                { time: 'Feb', value: 86.7 },
                { time: 'Mar', value: 87.5 },
                { time: 'Apr', value: 85.8 },
                { time: 'May', value: 86.3 },
                { time: 'Jun', value: 87.1 },
                { time: 'Jul', value: 86.4 },
                { time: 'Aug', value: 86.8 },
                { time: 'Sep', value: 87.6 },
                { time: 'Oct', value: 86.7 },
                { time: 'Nov', value: 87.3 },
                { time: 'Dec', value: 85.8 },
              ],
            },
            best: {
              '24 hours': { category: 'Vest', value: 96.0 },
              '7 days': { category: 'Helmet', value: 94.5 },
              '30 days': { category: 'Gloves', value: 95.2 },
              '12 months': { category: 'Boots', value: 93.8 },
            },
            worst: {
              '24 hours': { category: 'Scaffold', value: 75.0 },
              '7 days': { category: 'Harness', value: 78.3 },
              '30 days': { category: 'Footwear', value: 79.1 },
              '12 months': { category: 'Guardrail', value: 76.4 },
            },
            growth: {
              '24 hours': 0,
              '7 days': 0,
              '30 days': 0,
              '12 months': 0,
            },
          },
          compliancebreakdown: {
            ppe: [
              { name: 'helmet', value: 82.2 },
              { name: 'vest', value: 96.0 },
              { name: 'footwear', value: 95.4 },
              { name: 'gloves', value: 91.2 },
            ],
            fall: [
              { name: 'scaffolding', value: 75.0 },
              { name: 'guardrails', value: 85.4 },
              { name: 'harness', value: 91 },
            ],
          },
          snapshots: [
            {
              id: 'img_001',
              url: 'https://i.postimg.cc/YSnYvDpk/Screenshot-2025-03-02-at-2-35-11-PM.png',
            },
            {
              id: 'img_002',
              url: 'https://i.postimg.cc/4djc5K7S/Screenshot-2025-03-02-at-2-35-36-PM.png',
            },
            {
              id: 'img_003',
              url: 'https://i.postimg.cc/QCwB7NvP/Screenshot-2025-03- 03-at-12-21-45-pm.png',
            },
          ],
          sessionduration: {
            hours: 3,
            minutes: 26,
          },
          activecameras: 2,
          recentincidents: [
            {
              timestamp: '2024-12-30T17:39:00',
              category: 'scaffolding',
              severity: 'Medium',
            },
            {
              timestamp: '2024-12-30T17:31:00',
              category: 'vest',
              severity: 'Medium',
            },
            {
              timestamp: '2024-12-30T17:18:00',
              category: 'footwear',
              severity: 'Medium',
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data available.</div>;
  }

  return (
    <div className={`${styles.dashboard} ${isPWA ? styles.mobile : ''}`}>
      <h1>Dashboard</h1>
      <main>
        <div className={`${styles.row}`}>
          <SafetyScoreCard data={data.safetyscore} isPWA={isPWA} />
          <SafetyScoreTrends data={data.trends} isPWA={isPWA} />
        </div>
        <div className={`${styles.row} ${styles.secondRow}`}>
          <ComplianceBreakdown
            data={data.compliancebreakdown}
            className={styles.complianceBreakdown}
            isPWA={isPWA}
          />
          <div className={styles.column}>
            {!isPWA && <Snapshots data={data?.snapshots} />}

            <div className={styles.row}>
              <SessionDuration data={data.sessionduration} isPWA={isPWA} />
              <ActiveCameras
                data={data.activecameras ? data.activecameras : 1}
                isPWA={isPWA}
              />
            </div>
            <RecentIncidents
              data={data.recentincidents}
              className={styles.recentIncidents}
              isPWA={isPWA}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
