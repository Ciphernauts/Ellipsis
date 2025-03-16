import styles from './SafetyTrendGraph.module.css';
import React, { useState } from 'react';
import Percentage from '../Percentage';
import ArrowIcon from '../icons/ArrowIcon';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import CustomTooltip from '../CustomTooltip';
import { capitalizeFirstLetter } from '../../utils/helpers';

const SafetyTrendGraph = ({ data, isPWA = false }) => {
  const timeframes = ['24 hours', '7 days', '30 days', '12 months'];

  // Function to find the first timeframe with non-empty data
  const findFirstValidTimeframe = () => {
    for (const timeframe of timeframes) {
      if (data.trends[timeframe] && data.trends[timeframe].length > 0) {
        return timeframe;
      }
    }
    return timeframes[0]; // Fallback to the first timeframe if none are valid
  };

  const [timeframe, setTimeframe] = useState(findFirstValidTimeframe());

  // Fetch current average compliance percentage
  const averageCompliance = data?.currentAvg || 0;

  // Badge function for compliance level
  const getComplianceBadge = (compliance) => {
    if (compliance >= 85) {
      return <span className={`${styles.badge} ${styles.good}`}>Good</span>;
    } else if (compliance >= 70) {
      return (
        <span className={`${styles.badge} ${styles.satisfactory}`}>
          Satisfactory
        </span>
      );
    } else {
      return <span className={`${styles.badge} ${styles.poor}`}>Poor</span>;
    }
  };

  // Transform data for the selected timeframe
  const chartData = data.trends[timeframe] || [];

  const growthColor = data.growth[timeframe] >= 0 ? '#0FD7A5' : '#D21616';

  return (
    <div
      className={`${styles.card} ${'dashboardCard'} ${isPWA ? styles.mobile : ''}`}
    >
      {/* Header Section */}
      <div className={styles.header}>
        <h2>Safety Compliance Trends</h2>
        <div className={styles.options}>
          {['24 hours', '7 days', '30 days', '12 months'].map((option) => (
            <span
              key={option}
              className={`${styles.timeOption} ${timeframe === option ? styles.active : ''}`}
              onClick={() => setTimeframe(option)}
            >
              Last {option}
            </span>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className={styles.content}>
        <div className={styles.metrics}>
          {/* Current Average Compliance with Badge */}
          <div className={styles.metricContainer}>
            <div className={styles.metricHeading}>
              <div className={styles.complianceWrapper}>
                <div className={styles.metricHeading}>
                  <span className={styles.metricLabel}>Current Avg.</span>
                  {getComplianceBadge(averageCompliance)}
                </div>
                <Percentage
                  number={averageCompliance}
                  label=''
                  label2=''
                  label2size={12}
                  label2weight={600}
                  numberSize={22}
                  symbolSize={16}
                />
              </div>
            </div>
          </div>

          {/* Compliance Growth */}
          <div className={styles.metricContainer}>
            <div
              className={`${styles.growthContainer} ${data.growth[timeframe] >= 0 ? styles.growth : styles.decline}`}
            >
              <span>
                <ArrowIcon color={growthColor} className={styles.arrow} />
                <Percentage
                  number={Math.abs(data.growth[timeframe])} // Ensure positive number
                  numberSize={22}
                  symbolSize={15}
                />
              </span>
              <p>
                vs 1{' '}
                {
                  {
                    '24 hours': 'hour',
                    '7 days': 'day',
                    '30 days': 'day',
                    '12 months': 'month',
                  }[timeframe]
                }{' '}
                ago
              </p>
            </div>
          </div>

          {/* Best & Worst Compliance Side by Side */}
          {!isPWA &&
            (data.maxScore ? (
              <div className={styles.metricRow}>
                <div className={styles.metricContainer}>
                  <div className={styles.leftAlign}>
                    <Percentage
                      number={data.maxScore[timeframe]}
                      label='Max Score'
                      labelSize={11}
                      numberSize={20}
                      symbolSize={16}
                    />
                  </div>
                </div>

                <div className={styles.metricContainer}>
                  <div className={styles.leftAlign}>
                    <Percentage
                      number={data.minScore[timeframe]}
                      label='Min Score'
                      labelSize={11}
                      numberSize={20}
                      symbolSize={16}
                    />
                  </div>
                </div>
              </div>
            ) : data.bestMetric.category ? (
              <div className={styles.metricRow}>
                <div className={styles.metricContainer}>
                  <div className={styles.leftAlign}>
                    <Percentage
                      number={data.bestMetric.value}
                      label='Best Metric'
                      label2={capitalizeFirstLetter(data.bestMetric.category)}
                      labelSize={11}
                      numberSize={20}
                      symbolSize={16}
                    />
                  </div>
                </div>

                <div className={styles.metricContainer}>
                  <div className={styles.leftAlign}>
                    <Percentage
                      number={data.worstMetric.value}
                      label='Worst Metric'
                      label2={capitalizeFirstLetter(data.worstMetric.category)}
                      labelSize={11}
                      numberSize={20}
                      symbolSize={16}
                    />
                  </div>
                </div>
              </div>
            ) : null)}
        </div>

        {/* Chart Section */}
        <div className={styles.chartContainer}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width={isPWA ? '119%' : '100%'} height={230}>
              <AreaChart key={timeframe} data={chartData}>
                <defs>
                  <linearGradient
                    id='colorGradient'
                    x1='0'
                    y1='0'
                    x2='0'
                    y2='1'
                  >
                    <stop
                      offset='20%'
                      stopColor='var(--primary)'
                      stopOpacity={1}
                    />
                    <stop
                      offset='100%'
                      stopColor='var(--primary)'
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray='3 3'
                  vertical={false}
                  horizontal
                  stroke='var(--neutral)'
                />
                <XAxis
                  dataKey='name'
                  fontSize={11}
                  fontWeight={600}
                  tick={{ fill: 'var(--neutral)' }}
                />
                <YAxis
                  domain={[80, 90]}
                  fontSize={11}
                  fontWeight={600}
                  tick={{ fill: 'var(--neutral)' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type='monotone'
                  dataKey='value'
                  stroke='none'
                  fill='url(#colorGradient)'
                  fillOpacity={1}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p
              style={{
                textAlign: 'center',
                marginTop: '20px',
                color: '#a8a8a8',
              }}
            >
              No data available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SafetyTrendGraph;
