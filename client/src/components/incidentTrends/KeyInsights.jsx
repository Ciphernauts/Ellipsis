import React from 'react';
import styles from './KeyInsights.module.css';
import bulletIcon from '../../assets/bulletPoint_icon.svg'; // Import the bullet point icon

export default function KeyInsights({ data, className, isPWA = false }) {
  if (!data) return <div>Loading insights...</div>;

  const insights = [];

  // Extract trends and breakdown data
  const { trends, breakdown } = data.trendsAndBreakdown;

  // Helper function to safely reduce arrays
  const safeReduce = (array, reducer, initialValue) => {
    return array.length > 0
      ? array.reduce(reducer, initialValue)
      : initialValue;
  };

  // Generate insights based on trends
  const highestHourlyTrend = safeReduce(
    trends['24 hours'],
    (prev, current) => (prev.value > current.value ? prev : current),
    { value: 0 }
  );
  insights.push({
    text: `Highest activity recorded at ${highestHourlyTrend.name} with ${highestHourlyTrend.value} incidents in the last 24 hours.`,
    score: highestHourlyTrend.value * 510, // Weight for hourly trend
  });

  const highestDailyTrend = safeReduce(
    trends['7 days'],
    (prev, current) => (prev.value > current.value ? prev : current),
    { value: 0, name: 'Unknown' } // Provide a default name
  );

  insights.push({
    text: `Most incidents occurred on ${highestDailyTrend.name ? highestDailyTrend.name.trim() : 'Unknown'} with ${highestDailyTrend.value} incidents in the last 7 days.`,
    score: highestDailyTrend.value * 18, // Weight for daily trend
  });

  const highestMonthlyTrend = safeReduce(
    trends['30 days'],
    (prev, current) => (prev.value > current.value ? prev : current),
    { value: 0 }
  );
  insights.push({
    text: `Peak incidents on ${highestMonthlyTrend.name} with ${highestMonthlyTrend.value} incidents in the last 30 days.`,
    score: highestMonthlyTrend.value * 18, // Weight for monthly trend
  });

  // Generate insights based on breakdown
  const highestBreakdownItem = safeReduce(
    breakdown['24 hours'],
    (prev, current) => (prev.value > current.value ? prev : current),
    { value: 0 }
  );
  insights.push({
    text: `Most common compliance risk in the last 24 hours: ${highestBreakdownItem.name} with ${highestBreakdownItem.value} incidents.`,
    score: highestBreakdownItem.value * 510, // Weight for breakdown (hourly)
  });

  // Generate insights based on alert metrics
  const totalIncidentsLast24Hours =
    data.alertMetrics['24 hours'].totalIncidents || 0;
  insights.push({
    text: `Total incidents reported in the last 24 hours: ${totalIncidentsLast24Hours}.`,
    score: totalIncidentsLast24Hours * 18, // Weight for alert metrics (24 hours)
  });

  const totalResolvedLast24Hours = data.alertMetrics['24 hours'].resolved || 0;
  insights.push({
    text: `Total resolved incidents in the last 24 hours: ${totalResolvedLast24Hours}.`,
    score: totalResolvedLast24Hours * 18, // Weight for alert metrics (24 hours)
  });

  const totalFalseAlarmsLast7Days = data.alertMetrics['7 days'].falseAlarm || 0;
  insights.push({
    text: `Total false alarms in the last 7 days: ${totalFalseAlarmsLast7Days}.`,
    score: totalFalseAlarmsLast7Days * 4, // Weight for alert metrics (7 days)
  });

  const highestCriticalIncidents =
    data.alertMetrics['12 months'].criticalIncidents || 0;
  insights.push({
    text: `Total critical incidents in the last 12 months: ${highestCriticalIncidents}.`,
    score: highestCriticalIncidents * 1, // Weight for alert metrics (12 months)
  });

  // New insights
  const totalIncidentsLast30Days =
    data.alertMetrics['30 days'].totalIncidents || 0;
  insights.push({
    text: `Total incidents reported in the last 30 days: ${totalIncidentsLast30Days}.`,
    score: totalIncidentsLast30Days * 1, // Weight for alert metrics (30 days)
  });

  const totalResolvedLast30Days = data.alertMetrics['30 days'].resolved || 0;
  insights.push({
    text: `Total resolved incidents in the last 30 days: ${totalResolvedLast30Days}.`,
    score: totalResolvedLast30Days * 1, // Weight for alert metrics (30 days)
  });

  const mostCommonItemLast7Days = safeReduce(
    breakdown['7 days'],
    (prev, current) => (prev.value > current.value ? prev : current),
    { value: 0 }
  );
  insights.push({
    text: `Most compliance risk in the last 7 days: ${mostCommonItemLast7Days.name} with ${mostCommonItemLast7Days.value} incidents.`,
    score: mostCommonItemLast7Days.value * 4, // Weight for breakdown (7 days)
  });

  const totalIncidentsLast12Months =
    data.alertMetrics['12 months'].totalIncidents || 0;
  insights.push({
    text: `Total incidents reported in the last 12 months: ${totalIncidentsLast12Months}.`,
    score: totalIncidentsLast12Months * 0.083, // Weight for alert metrics (12 months)
  });

  // Sort insights by score in descending order and limit to top 5
  const topInsights = insights.sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <div
      className={`${'dashboardCard'} ${styles.card} ${className} ${isPWA ? styles.mobile : ''}`}
    >
      <h2>Key Insights</h2>
      <ul className={styles.insightsList}>
        {topInsights.map((insight, index) => (
          <li key={index}>
            <img src={bulletIcon} alt='•' />
            {insight.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
