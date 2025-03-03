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

const SafetyTrendGraph = ({ data, category }) => {
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

  // Determine best compliance metric
  const bestMetric = useMemo(() => {
    if (!chartData.length) return { name: '', score: 0 };
    const best = Math.max(...chartData.map((d) => d.compliance));
    return { name: category, score: best };
  }, [chartData, category]);

  // Determine worst compliance metric
  const worstMetric = useMemo(() => {
    if (!chartData.length) return { name: '', score: 0 };
    const worst = Math.min(...chartData.map((d) => d.compliance));
    return { name: category, score: worst };
  }, [chartData, category]);

  return (
    <div className={styles.card}>
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
        <div>
          {/* Compliance Growth */}
          <div
            className={`${styles.growthContainer} ${growth.positive ? styles.growth : styles.decline}`}
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

          {/* Current Average Compliance with Badge */}
          <div className={styles.metricContainer}>
            <div className={styles.metricHeading}>
              <Percentage
                number={averageCompliance}
                label='Avg. Compliance'
                label2='' // No category name
                label2size={12}
                label2weight={600}
                numberSize={20}
                symbolSize={16}
              />
              {getComplianceBadge(averageCompliance)}
            </div>
          </div>

          {/* Best Compliance */}
          <div className={styles.metricContainer}>
            <Percentage
              number={bestMetric.score}
              label='Best Compliance'
              label2={bestMetric.name}
              label2size={12}
              label2weight={600}
              numberSize={20}
              symbolSize={16}
            />
          </div>

          {/* Worst Compliance */}
          <div className={styles.metricContainer}>
            <Percentage
              number={worstMetric.score}
              label='Worst Compliance'
              label2={worstMetric.name}
              label2size={12}
              label2weight={600}
              numberSize={20}
              symbolSize={16}
            />
          </div>
        </div>

        {/* Chart Section */}
        <div
          className={styles.chartContainer}
          style={{ width: '100%', height: '250px' }}
        >
          {chartData.length > 0 ? (
            <ResponsiveContainer width='100%' height={200}>
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
