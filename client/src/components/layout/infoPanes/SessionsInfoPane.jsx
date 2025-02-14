import React, { useState, useRef, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './SessionsInfoPane.module.css';
import { NextArrow, PrevArrow } from '../../CustomArrows';
import Duration from '../../Duration';
import PaneInfoPiece from '../../PaneInfoPiece';
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

export default function SessionsInfoPane({ data }) {
  if (!data) {
    return (
      <div className={styles.pane}>
        <p>Loading session details...</p>
      </div>
    );
  }

  const settings = {
    speed: 300,
    slidesToScroll: 1,
    centerMode: true,
    infinite: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const formatTimestamp = (isoString) => {
    if (!isoString) return '';
    return isoString.replace('T', ' ').replace('Z', '');
  };

  const startTime = data.startTime ? formatTimestamp(data.startTime) : '';
  const endTime = data.endTime ? formatTimestamp(data.endTime) : '';

  const trendsData = data.trends.map((trend) => ({
    interval: trend.time,
    score: trend.score,
  }));

  const safetyDistributionData = Object.entries(
    data.safetyScoreDistribution
  ).map(([key, value]) => ({
    name: capitalizeFirstLetter(key),
    value: value,
  }));

  return (
    <div className={`${styles.pane}`}>
      <h1>{data.sessionId}</h1>
      <div className={styles.content}>
        <div className={styles.snapshotsSection}>
          <h2>Snapshot Gallery</h2>
          <div className={`${styles.sliderContainer}`}>
            <Slider {...settings} className={styles.snapshots}>
              {data.snapshots.map((item, index) => (
                <div key={index} className={`${styles.snapshotItem}`}>
                  <img
                    src={item}
                    alt={`Snapshot ${index + 1}`}
                    className={styles.snapshotImage}
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
        <div className={styles.infoBlock}>
          <div className={styles.row}>
            <PaneInfoPiece name='Mode' value={data.mode} />
            <PaneInfoPiece
              name='Duration'
              value={
                <Duration
                  hours={data.duration.hours}
                  minutes={data.duration.minutes}
                  seconds={data.duration.seconds}
                  size='small'
                />
              }
            />
          </div>
          <div className={styles.row}>
            <PaneInfoPiece
              name='Start'
              value={formatTimestamp(startTime)}
              fontSize={12}
            />
            <PaneInfoPiece
              name='End'
              value={formatTimestamp(endTime)}
              fontSize={12}
            />
          </div>
        </div>
        <div className={styles.infoBlock}>
          <div className={styles.row}>
            <PaneInfoPiece name='Safety score' value={data.safetyScore} />
            <PaneInfoPiece name='Session Progress' value={data.progress} />
          </div>
          <div className={styles.row}>
            <PaneInfoPiece name='Total incidents' value={data.totalIncidents} />
            <PaneInfoPiece
              name='Critical incidents'
              value={data.criticalIncidents}
            />
          </div>
        </div>
        <div className={styles.trendsSection}>
          <h2>Trends</h2>
          <ResponsiveContainer
            width='115%'
            height={182}
            className={styles.chartContainer}
          >
            <AreaChart data={trendsData}>
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
              <Tooltip />
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
        <div className={styles.distributionSection}>
          <h2>Safety Score Distribution</h2>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart
              data={safetyDistributionData}
              margin={{ top: 20, right: 0, left: 0, bottom: 65 }} // Ensure labels don't get cut off
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
                    {/* Top Label (At the top of the background bar) */}
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
                    {/* Bottom Label (Below each bar) */}
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
        </div>
      </div>
    </div>
  );
}
