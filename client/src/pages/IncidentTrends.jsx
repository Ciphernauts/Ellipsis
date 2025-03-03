import { useState, useEffect } from 'react';
import styles from './IncidentTrends.module.css';
import IncidentTrendsAndBreakdownCard from '../components/incidentTrends/IncidentTrendsAndBreakdownCard';
import KeyInsights from '../components/incidentTrends/KeyInsights';
import AlertMetrics from '../components/incidentTrends/AlertMetrics';
import axios from 'axios'; // Import Axios for API calls

export default function IncidentTrends({ isPWA = false }) {
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/incidents/trends-trends');
        if (response.data) {
          setCardData(response.data); // Set the data from the API response
        } else {
          throw new Error('No data returned from API');
        }
      } catch (error) {
        console.error('Error fetching incident trends:', error);
        setCardData({
          trendsAndBreakdown: {
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
            breakdown: {
              '24 hours': [
                { name: 'helmet', value: 12 },
                { name: 'footwear', value: 8 },
                { name: 'vest', value: 6 },
                { name: 'gloves', value: 4 },
                { name: 'scaffolding', value: 5 },
                { name: 'guardrails', value: 3 },
                { name: 'harness', value: 7 },
              ],
              '7 days': [
                { name: 'helmet', value: 16 },
                { name: 'footwear', value: 21 },
                { name: 'vest', value: 30 },
                { name: 'gloves', value: 25 },
                { name: 'scaffolding', value: 20 },
                { name: 'guardrails', value: 15 },
                { name: 'harness', value: 18 },
              ],
              '30 days': [
                { name: 'helmet', value: 180 },
                { name: 'footwear', value: 150 },
                { name: 'vest', value: 130 },
                { name: 'gloves', value: 110 },
                { name: 'scaffolding', value: 95 },
                { name: 'guardrails', value: 80 },
                { name: 'harness', value: 85 },
              ],
              '12 months': [
                { name: 'helmet', value: 900 },
                { name: 'footwear', value: 1850 },
                { name: 'vest', value: 1700 },
                { name: 'gloves', value: 1600 },
                { name: 'scaffolding', value: 1400 },
                { name: 'guardrails', value: 1250 },
                { name: 'harness', value: 1350 },
              ],
            },
          },
          alertMetrics: {
            '24 hours': {
              open: 15,
              resolved: 5,
              falseAlarm: 1,
              totalIncidents: 18,
              topIncidentConstructionSite: 'Hilltop Height Construction',
              criticalIncidents: 1,
              moderateIncidents: 17,
            },
            '7 days': {
              open: 102,
              resolved: 76,
              falseAlarm: 5,
              totalIncidents: 120,
              topIncidentConstructionSite: 'Downtown Tower Project',
              criticalIncidents: 12,
              moderateIncidents: 108,
            },
            '30 days': {
              open: 340,
              resolved: 290,
              falseAlarm: 15,
              totalIncidents: 380,
              topIncidentConstructionSite: 'Eastside Mall Development',
              criticalIncidents: 38,
              moderateIncidents: 342,
            },
            '12 months': {
              open: 4050,
              resolved: 3900,
              falseAlarm: 75,
              totalIncidents: 4500,
              topIncidentConstructionSite: 'West Bay Bridge Renovation',
              criticalIncidents: 420,
              moderateIncidents: 4080,
            },
          },
        });
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!cardData) {
    return <div>No data available.</div>;
  }

  return (
    <div className={`${styles.incidentTrends} ${isPWA ? styles.mobile : ''}`}>
      <h1>Incident Trends</h1>
      <main>
        <AlertMetrics
          data={cardData.alertMetrics}
          className={styles.alertMetrics}
          isPWA={isPWA}
        />
        <div className={styles.row}>
          <IncidentTrendsAndBreakdownCard
            data={cardData.trendsAndBreakdown}
            className={styles.incidentTrendsAndBreakdown}
            isPWA={isPWA}
          />
          <KeyInsights className={styles.keyInsights} isPWA={isPWA} />
        </div>
      </main>
    </div>
  );
}
