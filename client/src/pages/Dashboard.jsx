import { useState, useEffect } from 'react';
import SafetyScoreCard from '../components/dashboard/SafetyScoreCard';
import SafetyScoreTrends from '../components/dashboard/SafetyScoreTrends';
import ComplianceBreakdown from '../components/dashboard/ComplianceBreakdown';
import Snapshots from '../components/dashboard/Snapshots';
import SessionDuration from '../components/dashboard/SessionDuration';
import ActiveCameras from '../components/dashboard/ActiveCameras';
import RecentIncidents from '../components/dashboard/RecentIncidents';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    // Simulating API fetch
    const fetchData = async () => {
      const data = {
        safetyScore: {
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
              { time: '6:00 AM', score: 85.2 },
              { time: '7:00 AM', score: 87.1 },
              { time: '8:00 AM', score: 86.4 },
              { time: '9:00 AM', score: 88.3 },
              { time: '10:00 AM', score: 85.9 },
              { time: '1:00 PM', score: 86.5 },
              { time: '2:00 PM', score: 87.4 },
              { time: '3:00 PM', score: 86.8 },
              { time: '4:00 PM', score: 87.0 },
              { time: '5:00 PM', score: 89.3 },
              { time: '7:00 PM', score: 86.9 },
            ],
            '7 days': [
              { time: 'Mon', score: 85.2 },
              { time: 'Tue', score: 87.1 },
              { time: 'Wed', score: 86.4 },
              { time: 'Thu', score: 88.3 },
              { time: 'Fri', score: 85.9 },
              { time: 'Sat', score: 86.7 },
              { time: 'Sun', score: 87.7 },
            ],
            '30 days': [
              { time: '1 Jan', score: 85.4 },
              { time: '2 Jan', score: 86.1 },
              { time: '3 Jan', score: 85.9 },
              { time: '4 Jan', score: 87.2 },
              { time: '5 Jan', score: 86.5 },
              { time: '6 Jan', score: 88.0 },
              { time: '7 Jan', score: 85.8 },
              { time: '8 Jan', score: 86.9 },
              { time: '9 Jan', score: 87.4 },
              { time: '10 Jan', score: 85.6 },
              { time: '11 Jan', score: 86.3 },
              { time: '12 Jan', score: 87.8 },
              { time: '13 Jan', score: 86.7 },
              { time: '14 Jan', score: 85.5 },
              { time: '15 Jan', score: 87.0 },
              { time: '16 Jan', score: 86.2 },
              { time: '17 Jan', score: 88.1 },
              { time: '18 Jan', score: 86.8 },
              { time: '19 Jan', score: 87.3 },
              { time: '20 Jan', score: 85.7 },
              { time: '21 Jan', score: 86.9 },
              { time: '22 Jan', score: 87.5 },
              { time: '23 Jan', score: 85.8 },
              { time: '24 Jan', score: 86.4 },
              { time: '25 Jan', score: 87.2 },
              { time: '26 Jan', score: 86.0 },
              { time: '27 Jan', score: 88.2 },
              { time: '28 Jan', score: 85.9 },
              { time: '29 Jan', score: 86.7 },
              { time: '30 Jan', score: 87.1 },
            ],
            '12 months': [
              { time: 'Jan', score: 85.9 },
              { time: 'Feb', score: 86.7 },
              { time: 'Mar', score: 87.5 },
              { time: 'Apr', score: 85.8 },
              { time: 'May', score: 86.3 },
              { time: 'Jun', score: 87.1 },
              { time: 'Jul', score: 86.4 },
              { time: 'Aug', score: 86.8 },
              { time: 'Sep', score: 87.6 },
              { time: 'Oct', score: 86.7 },
              { time: 'Nov', score: 87.3 },
              { time: 'Dec', score: 85.8 },
            ],
          },
          best: {
            '24 hours': { name: 'Vest', score: 96.0 },
            '7 days': { name: 'Helmet', score: 94.5 },
            '30 days': { name: 'Gloves', score: 95.2 },
            '12 months': { name: 'Boots', score: 93.8 },
          },
          worst: {
            '24 hours': { name: 'Scaffold', score: 75.0 },
            '7 days': { name: 'Harness', score: 78.3 },
            '30 days': { name: 'Footwear', score: 79.1 },
            '12 months': { name: 'Guardrail', score: 76.4 },
          },
        },
        complianceBreakdown: {
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
            url: 'https://picsum.photos/284/129',
            metadata: { description: 'Top Image' },
          },
          {
            id: 'img_002',
            url: 'https://picsum.photos/142/129',
            metadata: { description: 'Bottom Left Image' },
          },
          {
            id: 'img_003',
            url: 'https://picsum.photos/143/129',
            metadata: { description: 'Bottom Right Image' },
          },
        ],
        sessionDuration: {
          hours: 3,
          minutes: 26,
        },
        activeCameras: 2,
        recentIncidents: [
          {
            timestamp: '2024-12-30T17:39:00',
            name: 'Improper Scaffolding',
            severity: 'Medium',
          },
          {
            timestamp: '2024-12-30T17:31:00',
            name: 'Missing Vest',
            severity: 'Medium',
          },
          {
            timestamp: '2024-12-30T17:18:00',
            name: 'Scaffold overturning',
            severity: 'High',
          },
        ],
      };

      setDashboardData(data);
    };

    fetchData();
  }, []);

  if (!dashboardData) return <div>Loading...</div>;

  return (
    <div className={styles.dashboard}>
      <h1>Dashboard</h1>
      <main>
        <div className={styles.row}>
          <SafetyScoreCard data={dashboardData.safetyScore} />
          <SafetyScoreTrends data={dashboardData.trends} />
        </div>
        <div className={styles.row}>
          <ComplianceBreakdown data={dashboardData.complianceBreakdown} />
          <div className={styles.column}>
            <Snapshots data={dashboardData.snapshots} />
            <div className={styles.row}>
              <SessionDuration data={dashboardData.sessionDuration} />
              <ActiveCameras data={dashboardData.activeCameras} />
            </div>
            <RecentIncidents data={dashboardData.recentIncidents} />
          </div>
        </div>
      </main>
    </div>
  );
}
