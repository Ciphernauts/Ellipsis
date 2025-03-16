import React, { useState, useMemo } from 'react';
import styles from './IncidentTrendsAndBreakdownCard.module.css';
import Percentage from '../Percentage';
import ArrowIcon from '../icons/ArrowIcon';
import { capitalizeFirstLetter } from '../../utils/helpers';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import CustomTooltip from '../CustomTooltip';

export default function IncidentTrendsAndBreakdownCard({
  data,
  className,
  isPWA = false,
}) {
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
  const [view, setView] = useState('trends'); // 'trends' or 'breakdown'

  const trendsData = useMemo(() => data.trends[timeframe] || [], [timeframe]);

  const growth = useMemo(() => {
    if (trendsData.length < 2) return { number: 0, positive: true };
    const last = trendsData[trendsData.length - 1].value;
    const secondLast = trendsData[trendsData.length - 2].value;
    return {
      number: Math.abs(last - secondLast),
      positive: last > secondLast,
    };
  }, [trendsData]);

  const growthColor = growth.positive ? '#0FD7A5' : '#D21616';

  const chartData = useMemo(
    () => data[view][timeframe] || [],
    [view, timeframe]
  );

  const averageIncidents = useMemo(() => {
    if (!trendsData.length) return 0;
    const total = trendsData.reduce((sum, item) => sum + item.value, 0);
    return (total / trendsData.length).toFixed(1);
  }, [trendsData]);

  const mostFrequentIncident = useMemo(() => {
    if (!data.breakdown[timeframe]?.length) return null;
    const mostFrequent = data.breakdown[timeframe].reduce((prev, current) =>
      prev.value > current.value ? prev : current
    );
    return {
      ...mostFrequent,
      name: capitalizeFirstLetter(mostFrequent.name),
    };
  }, [timeframe, data.breakdown]);

  return (
    <div
      className={`${'dashboardCard'} ${styles.card} ${className} ${isPWA ? styles.mobile : ''}`}
    >
      <div className={styles.viewOptions}>
        <div
          className={view === 'trends' ? styles.active : ''}
          onClick={() => setView('trends')}
        >
          <span>Trends</span>
        </div>
        <div
          className={view === 'breakdown' ? styles.active : ''}
          onClick={() => setView('breakdown')}
        >
          <span>Breakdown</span>
        </div>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.header}>
          {view === 'trends' ? (
            <h2>
              Incident Frequency for Every{' '}
              {
                {
                  '24 hours': 'Hour',
                  '7 days': 'Day',
                  '30 days': 'Day',
                  '12 months': 'Month',
                }[timeframe]
              }
            </h2>
          ) : (
            <h2>Breaking Down Incidents by Category</h2>
          )}
          <div className={styles.options}>
            {Object.keys(data.trends).map((option) => (
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
          {trendsData.length ? (
            <>
              <div className={styles.column}>
                <div
                  className={`${styles.growthContainer} ${
                    growth.positive ? styles.growth : styles.decline
                  }`}
                >
                  <span>
                    <ArrowIcon color={growthColor} className={styles.arrow} />
                    <Percentage
                      number={growth.number}
                      numberSize={isPWA ? 20 : 22}
                      symbolSize={isPWA ? 13 : 15}
                      symbol=''
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
                <div className={styles.incidentRate}>
                  <Percentage
                    number={averageIncidents}
                    label='Incident Rate'
                    numberSize={isPWA ? 19 : 20}
                    symbolSize={isPWA ? 12 : 14}
                    symbol={
                      '/ ' +
                      {
                        '24 hours': 'hr',
                        '7 days': 'day',
                        '30 days': 'day',
                        '12 months': 'mon',
                      }[timeframe]
                    }
                    className={styles.info}
                  />
                </div>
                <div className={styles.mostFrequentIncident}>
                  <Percentage
                    number=''
                    label='Top Incident'
                    label2={mostFrequentIncident.name}
                    label2size={isPWA ? 13 : 12}
                    symbol=''
                    className={styles.info}
                  />
                </div>
              </div>
              <ResponsiveContainer
                width={isPWA ? '110%' : '100%'}
                height={182}
                className={styles.chartContainer}
              >
                {view === 'trends' ? (
                  <AreaChart data={chartData}>
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
                          stopOpacity={0.1}
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
                      dataKey='name'
                      fontSize={11}
                      fontWeight={600}
                      tick={{ fill: 'var(--neutral)' }}
                    />
                    <YAxis
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
                ) : (
                  <BarChart data={chartData} barSize={'7%'}>
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
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray='3 3'
                      vertical={false}
                      horizontal={false}
                      stroke='var(--neutral)'
                    />
                    <XAxis
                      dataKey='name'
                      fontSize={11}
                      fontWeight={600}
                      tick={{ fill: 'var(--neutral)' }}
                    />
                    <YAxis
                      fontSize={11}
                      fontWeight={600}
                      tick={{ fill: 'var(--neutral)' }}
                    />
                    <Tooltip content={<CustomTooltip />} />

                    <Bar
                      dataKey='value'
                      fill='url(#colorGradient)'
                      radius={[10, 10, 0, 0]}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </>
          ) : (
            <p className={styles.noData}>No data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
