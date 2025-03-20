import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './IncidentsInfoPane.module.css';
import PaneInfoPiece from '../../PaneInfoPiece';
import DroneIcon from '../../icons/DroneIcon';
import CameraIcon from '../../icons/CameraIcon';

export default function IncidentsInfoPane({
  data,
  setIncidentData,
  isPWA = false,
}) {
  const [status, setStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (data) {
      setStatus(data.status || '');
    }
  }, [data]);

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    setStatus(newStatus);
    setUpdating(true);

    try {
      // Use the correct API endpoint to update the incident status
      const response = await axios.put(
        `https://ellipsis-1.onrender.com/api/incidents/incident-history/${data.id}/${newStatus}`
      );
      const updatedIncidentFromServer = response.data;

      // Update the local state directly
      setIncidentData({ ...data, status: updatedIncidentFromServer.status });
    } catch (error) {
      console.error('Error updating status:', error);
      setStatus(data.status); // Revert to the previous status in case of an error
      alert('Error updating status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const formatTimestamp = (isoString) => {
    return isoString ? isoString.replace('T', ' ').replace('Z', '') : '';
  };

  if (!data) {
    return (
      <div className={styles.pane}>
        <p>Loading incident details...</p>
      </div>
    );
  }

  return (
    <div className={`${styles.pane} ${isPWA ? styles.mobile : ''}`}>
      <h1>{data.name}</h1>
      <div className={styles.content}>
        {data.snapshot && !isPWA && (
          <img
            src={data.snapshot}
            alt={`Snapshot of ${data.site}`}
            className={styles.snapshotImage}
          />
        )}
        <PaneInfoPiece
          name='Incident Status'
          value={
            <select
              id='incidentStatus'
              value={status}
              onChange={handleStatusChange}
              className={styles.statusDropdown}
              disabled={updating}
            >
              <option value='Open'>Open</option>
              <option value='Resolved'>Resolved</option>
              <option value='False Alarm'>False Alarm</option>
            </select>
          }
          className={styles.infoPieceDropdown}
        />
        <div className={styles.infoBlock}>
          <div className={styles.row}>
            <PaneInfoPiece name='Session ID' value={data.sessionId} />
            <PaneInfoPiece name='Mode' value={data.mode} />
          </div>
          <div className={styles.row}>
            <PaneInfoPiece
              name='Timestamp'
              value={formatTimestamp(data.time)}
              fontSize={12}
            />
            <PaneInfoPiece
              name='Severity'
              value={data.isCritical ? 'Critical' : 'Medium'}
            />
          </div>
          <PaneInfoPiece name='Construction site' value={data.site} />
          <PaneInfoPiece
            name='Device'
            value={
              <>
                <span>
                  {data?.device?.type === 'drone' ? (
                    <DroneIcon />
                  ) : (
                    <CameraIcon />
                  )}
                </span>
                <span>{data?.device?.name}</span>
              </>
            }
            className={styles.deviceInfoPiece}
          />
        </div>
      </div>
    </div>
  );
}
