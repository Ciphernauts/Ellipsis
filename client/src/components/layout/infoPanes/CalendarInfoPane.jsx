import React, { useState, useRef, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './CalendarInfoPane.module.css';
import { NextArrow, PrevArrow } from '../../CustomArrows';
import Duration from '../../Duration';
import PaneInfoPiece from '../../PaneInfoPiece';
import ArrowIcon from '../../icons/ArrowIcon';
import Percentage from '../../Percentage';
import Button from '../../Button';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
} from 'recharts';
import { capitalizeFirstLetter } from '../../../utils/helpers';
import CustomTooltip from '../../CustomTooltip';

export default function CalendarInfoPane({ data, isPWA = false, className }) {
  if (!data) return <div className={styles.pane}>Loading...</div>;

  // Provide default handleFunctions if not provided
  const handleFunctions = data.handleFunctions || {
    prev: () => {},
    next: () => {},
  };

  const settings = {
    arrows: !isPWA,
    speed: 300,
    slidesToScroll: 1,
    centerMode: true,
    infinite: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  // Create chart data from the passed down data
  const trendsData = data.trends
    ? data.trends
        .map((trend) => {
          if (trend.date) {
            const dateObj = new Date(trend.date);
            const date = dateObj.getDate();
            const month = dateObj.toLocaleString('en-US', { month: 'short' });
            return { interval: `${date} ${month}`, score: trend.score };
          } else if (trend.time) {
            return { interval: trend.time, score: trend.score };
          }
          return null;
        })
        .filter((item) => item !== null)
    : [];

  const safetyDistributionData = data.safetyScoreDistribution
    ? Object.entries(data.safetyScoreDistribution).map(([key, value]) => ({
        name: capitalizeFirstLetter(key),
        value: value,
      }))
    : [];

  const top3Categories = [
    { title: 'Top 3 Improvements', key: 'improvements' },
    { title: 'Areas to Improve', key: 'declinedMetrics' },
  ];

  return (
    <div
      className={`${styles.pane} ${className} ${isPWA ? styles.mobile : ''}`}
    >
      <div className={styles.header}>
        {isPWA && (
          <span onClick={handleFunctions.prev} className={styles.arrowButton}>
            <ArrowIcon className={styles.prevArrow} />
          </span>
        )}
        <h1>{data.name}</h1>
        {isPWA && (
          <span onClick={handleFunctions.next} className={styles.arrowButton}>
            <ArrowIcon />
          </span>
        )}
      </div>
      <div className={styles.content}>
        {/* Snapshots Section */}
        <div className={styles.snapshotsSection}>
          <h2>Snapshot Gallery</h2>
          {data.snapshots && data.snapshots.length > 0 ? (
            <div className={styles.sliderContainer}>
              <Slider {...settings} className={styles.snapshots}>
                {data.snapshots.map((item, index) => (
                  <div key={index} className={styles.snapshotItem}>
                    <img
                      src={item}
                      alt={`Snapshot ${index + 1}`}
                      className={styles.snapshotImage}
                    />
                  </div>
                ))}
              </Slider>
            </div>
          ) : (
            <p>No snapshots available.</p>
          )}
        </div>

        {/* Info Block */}
        <div className={styles.infoBlock}>
          <div className={styles.row}>
            <PaneInfoPiece name='Safety score' value={data.safetyScore} />
            <PaneInfoPiece name='Monthly progress' value={data.progress} />
          </div>
          <div className={styles.row}>
            <PaneInfoPiece name='Total incidents' value={data.totalIncidents} />
            <PaneInfoPiece
              name='Critical incidents'
              value={data.criticalIncidents}
            />
          </div>
          <div className={styles.row}>
            <PaneInfoPiece
              name='Duration'
              value={
                data.duration ? (
                  <Duration
                    hours={data.duration.hours}
                    minutes={data.duration.minutes}
                    seconds={data.duration.seconds}
                    size='small'
                    isPWA={isPWA}
                  />
                ) : (
                  'Loading duration...'
                )
              }
            />
          </div>
        </div>

        {/* Trends Section */}
        <div className={styles.trendsSection}>
          <h2>Trends</h2>
          {trendsData && trendsData.length > 0 ? (
            <ResponsiveContainer
              width='115%'
              height={182}
              className={styles.chartContainer}
            >
              <AreaChart data={trendsData}>
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
                  vertical={true}
                  horizontal={false}
                  stroke='var(--neutral)'
                />
                <XAxis
                  dataKey='interval'
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
          ) : (
            <p>No trends data available.</p>
          )}
        </div>

        {/* Safety Score Distribution Section */}
        <div className={styles.distributionSection}>
          <h2>Safety Score Distribution</h2>
          {safetyDistributionData && safetyDistributionData.length > 0 ? (
            <ResponsiveContainer width='100%' height={300}>
              <BarChart
                data={safetyDistributionData}
                margin={{ top: 20, right: 0, left: 0, bottom: 65 }}
              >
                <Bar
                  dataKey='value'
                  fill='var(--primary)'
                  background={{
                    fill: 'var(--background-color)',
                    radius: [25, 25, 25, 25],
                  }}
                  radius={[25, 25, 25, 25]}
                  barSize={15}
                  label={({ x, width, value, name, viewBox }) => (
                    <>
                      <text
                        x={x + width / 2}
                        y={15}
                        fill='var(--primary)'
                        textAnchor='middle'
                        fontSize='10px'
                        fontWeight='400'
                      >
                        {value}
                      </text>
                      <text
                        x={x + width / 2}
                        y={viewBox.y + viewBox.height + 5}
                        fill='var(--dark)'
                        textAnchor='end'
                        fontSize='11px'
                        fontWeight='400'
                        transform={`rotate(-90, ${x + width / 2}, ${viewBox.y + viewBox.height + 5})`}
                      >
                        {name}
                      </text>
                    </>
                  )}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No safety score distribution data available.</p>
          )}
        </div>

        {/* Top 3 Improvements and Declines Section */}
        <div className={styles.top3Section}>
          {top3Categories.map(({ title, key }) => (
            <div className={styles.top3} key={key}>
              <h2>{title}</h2>
              {data.top3 && data.top3[key] && data.top3[key].length > 0 ? (
                <ul>
                  {data.top3[key].map((item) => (
                    <li
                      key={item.name}
                      className={item.positive ? styles.up : styles.down}
                    >
                      <PaneInfoPiece
                        name={capitalizeFirstLetter(item.name)}
                        value={
                          <span>
                            <ArrowIcon
                              className={`${styles.arrow} ${item.positive ? styles.up : styles.down}`}
                            />
                            <Percentage
                              number={item.value}
                              numberSize={22}
                              symbolSize={15}
                            />
                          </span>
                        }
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No {key} data available.</p>
              )}
            </div>
          ))}
        </div>

        {/* Download Report Button */}
        <div className={styles.buttonContainer}>
          <Button
            text='Download Report'
            size='large'
            icon={
              <svg
                width='28'
                height='25'
                viewBox='0 0 28 25'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <g id='Icon'>
                  <path
                    id='Vector 9'
                    d='M14 14.2061L13.3492 14.9653L14 15.5231L14.6508 14.9653L14 14.2061ZM15 5.20605C15 4.65377 14.5522 4.20605 14 4.20605C13.4477 4.20605 13 4.65377 13 5.20605L15 5.20605ZM7.51583 9.96531L13.3492 14.9653L14.6508 13.4468L8.81742 8.4468L7.51583 9.96531ZM14.6508 14.9653L20.4841 9.96531L19.1825 8.4468L13.3492 13.4468L14.6508 14.9653ZM15 14.2061L15 5.20605L13 5.20605L13 14.2061L15 14.2061Z'
                    fill='white'
                  />
                  <path
                    id='Vector 114'
                    d='M5.83337 16.2061L5.83337 17.2061C5.83337 18.3106 6.87804 19.2061 8.16671 19.2061L19.8334 19.2061C21.122 19.2061 22.1667 18.3106 22.1667 17.2061V16.2061'
                    stroke='white'
                    strokeWidth='2'
                  />
                </g>
              </svg>
            }
          />
        </div>
      </div>
    </div>
  );
}
