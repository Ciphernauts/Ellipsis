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

export default function SafetyScoreTrends({ data }) {
  const [timeframe, setTimeframe] = useState('24 hours');

  const chartData = useMemo(() => data.chart[timeframe] || [], [timeframe]);

  const growth = useMemo(() => {
    if (chartData.length < 2) return { number: 0, positive: true };
    const last = chartData[chartData.length - 1].score;
    const secondLast = chartData[chartData.length - 2].score;
    return {
      number: Math.abs(last - secondLast).toFixed(1),
      positive: last > secondLast,
    };
  }, [chartData]);

  const growthColor = growth.positive ? '#0FD7A5' : '#D21616';

  return (
    <div className={`${'dashboardCard'} ${styles.card}`}>
      <div className={styles.header}>
        <h2>Safety Score Trends</h2>
        <div className={styles.options}>
          {Object.keys(data.chart).map((option) => (
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
              number={data.best[timeframe].score}
              label='Best Metric'
              label2={data.best[timeframe].name}
              numberSize={20}
              symbolSize={16}
            />
          </div>
          <div className={styles.bestMetricContainer}>
            <Percentage
              number={data.worst[timeframe].score}
              label='Worst Metric'
              label2={data.worst[timeframe].name}
              numberSize={20}
              symbolSize={16}
            />
          </div>
        </div>
        <ResponsiveContainer width='100%' height={182}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id='colorGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='20%' stopColor='var(--primary)' stopOpacity={1} />
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
              dataKey='score'
              stroke='none'
              fill='url(#colorGradient)'
              fillOpacity={1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
