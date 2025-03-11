import styles from './SafetyTrendGraph.module.css';
import React, { useState, useMemo } from 'react';
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

const SafetyTrendGraph = ({ data, category, isPWA = false }) => {
  const [timeframe, setTimeframe] = useState('24 hours');

  // Fetch current average compliance percentage
  const averageCompliance = data?.currentAverageCompliance || 0;

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
  const chartData = useMemo(() => {
    return (
      data[timeframe]?.map((entry) => ({
        time: new Date(entry.date).toLocaleDateString(),
        compliance: entry.compliance,
      })) || []
    );
  }, [timeframe, data]);

  // Calculate growth trend
  const growth = useMemo(() => {
    if (chartData.length < 2) return { number: 0, positive: true };
    const last = chartData[chartData.length - 1].compliance;
    const secondLast = chartData[chartData.length - 2].compliance;
    return {
      number: Math.abs(last - secondLast).toFixed(1),
      positive: last > secondLast,
    };
  }, [chartData]);

  const growthColor = growth.positive ? '#0FD7A5' : '#D21616';

  // Determine best and worst compliance metrics
  const bestMetric = useMemo(() => {
    if (!chartData.length) return { name: '', score: 0 };
    const best = Math.max(...chartData.map((d) => d.compliance));
    return { name: category, score: best };
  }, [chartData, category]);

  const worstMetric = useMemo(() => {
    if (!chartData.length) return { name: '', score: 0 };
    const worst = Math.min(...chartData.map((d) => d.compliance));
    return { name: category, score: worst };
  }, [chartData, category]);

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
              className={`${styles.timeOption} ${
                timeframe === option ? styles.active : ''
              }`}
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
              className={`${styles.growthContainer} ${
                growth.positive ? styles.growth : styles.decline
              }`}
            >
              <span>
                <ArrowIcon color={growthColor} className={styles.arrow} />
                <Percentage
                  number={growth.number}
                  numberSize={22}
                  symbolSize={15}
                />
              </span>
              <p>vs last {timeframe}</p>
            </div>
          </div>
          {/* Best & Worst Compliance Side by Side */}
          {!isPWA && (
            <div className={styles.metricRow}>
              <div className={styles.metricContainer}>
                <div className={styles.leftAlign}>
                  <Percentage
                    number={bestMetric.score}
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
                    number={worstMetric.score}
                    label='Min Score'
                    labelSize={11}
                    numberSize={20}
                    symbolSize={16}
                  />
                </div>
              </div>
            </div>
          )}{' '}
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
                  dataKey='time'
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
                  dataKey='compliance'
                  stroke='none'
                  fill='url(#colorGradient)'
                  fillOpacity={1}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
              No data available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SafetyTrendGraph;
