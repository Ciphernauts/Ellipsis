import styles from './SafetyScoreTrends.module.css';
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

export default function SafetyScoreTrends({ data, isPWA = false }) {
  const timeframes = ['24 hours', '7 days', '30 days', '12 months'];

  // Function to find the first timeframe with non-empty data
  const findFirstValidTimeframe = () => {
    for (const timeframe of timeframes) {
      if (data.chart[timeframe] && data.chart[timeframe].length > 0) {
        return timeframe;
      }
    }
    return timeframes[0]; // Fallback to the first timeframe if none are valid
  };

  const [timeframe, setTimeframe] = useState(findFirstValidTimeframe());
  const chartData = useMemo(() => data.chart[timeframe] || [], [timeframe]);

  return (
    <div
      className={`${'dashboardCard'} ${styles.card} ${isPWA ? styles.mobile : ''}`}
    >
      <div className={styles.header}>
        <h2>Safety Score Trends</h2>
        <div className={styles.options}>
          {Object.keys(data?.chart).map((option) => (
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
      <div className={styles.content}>
        <div>
          <div
            className={`${styles.growthContainer} ${data?.growth?.[timeframe] >= 0 ? styles.growth : styles.decline}`}
          >
            <span>
              <ArrowIcon
                color={data?.growth?.[timeframe] >= 0 ? '#0FD7A5' : '#D21616'}
                className={styles.arrow}
              />
              <Percentage
                // number={growth.number}
                number={data?.growth?.[timeframe]}
                numberSize={isPWA ? 20 : 22}
                symbolSize={isPWA ? 13 : 15}
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
          <div className={styles.bestMetricContainer}>
            <Percentage
              number={data?.best?.value}
              label='Best Metric'
              label2={data?.best?.category}
              label2size={isPWA ? 11 : 12}
              label2weight={isPWA ? 500 : 600}
              numberSize={isPWA ? 19 : 20}
              symbolSize={isPWA ? 12 : 16}
            />
          </div>
          <div className={styles.bestMetricContainer}>
            <Percentage
              number={data?.worst?.value}
              label='Worst Metric'
              label2={data?.worst?.category}
              label2size={isPWA ? 11 : 12}
              label2weight={isPWA ? 500 : 600}
              numberSize={isPWA ? 19 : 20}
              symbolSize={isPWA ? 12 : 16}
            />
          </div>
        </div>
        {chartData.length > 0 ? (
          <ResponsiveContainer
            width={isPWA ? '119%' : '100%'}
            height={182}
            className={styles.chartContainer}
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id='colorGradient' x1='0' y1='0' x2='0' y2='1'>
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
                vertical={true}
                horizontal={false}
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
                dataKey='value'
                stroke='none'
                fill='url(#colorGradient)'
                fillOpacity={1}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p
            style={{ textAlign: 'center', marginTop: '20px' }}
            className={styles.noData}
          >
            No data available
          </p>
        )}
      </div>
    </div>
  );
}
