import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
import CustomTooltip from '../../CustomTooltip';

export default function SessionsInfoPane({ data }) {
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Set default values for selectedSite and selectedCamera when data changes
  useEffect(() => {
    if (data) {
      // Set selectedSite to the construction site ID if it exists, otherwise null
      setSelectedSite(data.sessionDetails?.constructionSite?.id || null);
      // Set selectedCamera to the camera ID if it exists, otherwise null
      setSelectedCamera(data.sessionDetails?.camera?.id || null);
    }
  }, [data]);

  // Provide default values for constructionSites and cameras
  const constructionSites = data?.constructionSites || [];
  const cameras = data?.cameras || [];

  // Check if required data exists, use defaults if not
  const safetyScoreDistribution =
    data?.sessionDetails?.safetyScoreDistribution || {};
  const trends = data?.sessionDetails?.trends || [];
  const snapshots = data?.sessionDetails?.snapshots || [];
  const duration = data?.sessionDetails?.duration || {
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

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

  const startTime = data?.sessionDetails?.startTime
    ? formatTimestamp(data.sessionDetails.startTime)
    : '';
  const endTime = data?.sessionDetails?.endTime
    ? formatTimestamp(data.sessionDetails.endTime)
    : '';

  const trendsData = trends.map((trend) => ({
    interval: trend.time,
    score: trend.score,
  }));

  const safetyDistributionData = Object.entries(safetyScoreDistribution).map(
    ([key, value]) => ({
      name: capitalizeFirstLetter(key),
      value: value,
    })
  );

  const handleSiteChange = async (event) => {
    const newSite = parseInt(event.target.value, 10);
    setSelectedSite(newSite);
    setUpdating(true);

    try {
      await updateSession(newSite, selectedCamera);
    } catch (error) {
      console.error('Error updating site:', error);
      setSelectedSite(data.sessionDetails?.constructionSite?.id || null); // Revert to the previous site in case of an error
      alert('Error updating site. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleCameraChange = async (event) => {
    const newCamera = parseInt(event.target.value, 10);
    setSelectedCamera(newCamera);
    setUpdating(true);

    try {
      await updateSession(selectedSite, newCamera);
    } catch (error) {
      console.error('Error updating camera:', error);
      setSelectedCamera(data.sessionDetails?.camera?.id || null); // Revert to the previous camera in case of an error
      alert('Error updating camera. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const updateSession = async (siteId, cameraId) => {
    try {
      const response = await axios.patch(`/api/sessions/${data.sessionId}`, {
        constructionSiteId: siteId,
        cameraId: cameraId,
      });

      if (response.data) {
        // Update the local state directly
        data.sessionDetails.constructionSite = constructionSites.find(
          (site) => site.id === siteId
        );
        data.sessionDetails.camera = cameras.find(
          (camera) => camera.id === cameraId
        );
      }
    } catch (error) {
      console.error('Failed to update session:', error);
      throw new Error('Failed to update session');
    }
  };

  if (!data) {
    return (
      <div className={styles.pane}>
        <p>Loading session details...</p>
      </div>
    );
  }

  return (
    <div className={`${styles.pane}`}>
      <h1>{data?.sessionDetails?.sessionId || 'Session Details'}</h1>
      <div className={styles.content}>
        <div className={styles.dropdowns}>
          <PaneInfoPiece
            name='Construction Site'
            value={
              <select
                value={selectedSite || ''}
                onChange={handleSiteChange}
                className={styles.dropdown}
                disabled={updating}
              >
                <option value=''>Select Construction Site</option>
                {constructionSites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </select>
            }
            className={styles.infoPieceDropdown}
          />
          <PaneInfoPiece
            name='Camera'
            value={
              <select
                value={selectedCamera || ''}
                onChange={handleCameraChange}
                className={styles.dropdown}
                disabled={updating}
              >
                <option value=''>Select Camera</option>
                {cameras.map((camera) => (
                  <option key={camera.id} value={camera.id}>
                    {camera.name}
                  </option>
                ))}
              </select>
            }
            className={styles.infoPieceDropdown}
          />
        </div>
        <div className={styles.snapshotsSection}>
          <h2>Snapshot Gallery</h2>
          <div className={`${styles.sliderContainer}`}>
            {snapshots.length > 0 ? (
              <Slider {...settings} className={styles.snapshots}>
                {snapshots.map((item, index) => (
                  <div key={index} className={`${styles.snapshotItem}`}>
                    <img
                      src={item}
                      alt={`Snapshot ${index + 1}`}
                      className={styles.snapshotImage}
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              <p>No snapshots available.</p>
            )}
          </div>
        </div>
        <div className={styles.infoBlock}>
          <div className={styles.row}>
            <PaneInfoPiece
              name='Mode'
              value={data?.sessionDetails?.mode || 'N/A'}
            />
            <PaneInfoPiece
              name='Duration'
              value={
                duration ? (
                  <Duration
                    hours={duration.hours}
                    minutes={duration.minutes}
                    seconds={duration.seconds}
                    size='small'
                  />
                ) : (
                  'Loading duration...'
                )
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
            <PaneInfoPiece
              name='Safety score'
              value={data?.sessionDetails?.safetyScore || 'N/A'}
            />
            <PaneInfoPiece
              name='Session Progress'
              value={data?.sessionDetails?.progress || 'N/A'}
            />
          </div>
          <div className={styles.row}>
            <PaneInfoPiece
              name='Total incidents'
              value={data?.sessionDetails?.totalIncidents || 0}
            />
            <PaneInfoPiece
              name='Critical incidents'
              value={data?.sessionDetails?.criticalIncidents || 0}
            />
          </div>
        </div>
        <div className={styles.trendsSection}>
          <h2>Trends</h2>
          {trendsData.length > 0 ? (
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
        <div className={styles.distributionSection}>
          <h2>Safety Score Distribution</h2>
          {safetyDistributionData.length > 0 ? (
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
      </div>
    </div>
  );
}
