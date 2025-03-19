import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import styles from './ConstructionSitesInfoPane.module.css';
import PaneInfoPiece from '../../PaneInfoPiece';
import Duration from '../../Duration';

export default function ConstructionSitesInfoPane({
  data,
  setSiteData,
  isPWA = false,
}) {
  const [isActive, setIsActive] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (data) {
      setIsActive(data.isActive || false);
    }
  }, [data]);

  const handleToggleChange = async () => {
    setUpdating(true);
    const previousIsActive = isActive; // Store the previous state

    try {
      // Make API call to update the status
      const response = await axios.put(
        `https://ellipsis-1.onrender.com/api/construction-sites/${data.id}`, // Use the correct API endpoint
        {
          isActive: !isActive, // Toggle the active status
        }
      );

      // Update the data only after a successful API call
      const updatedSiteFromServer = response.data;
      setSiteData(updatedSiteFromServer); // Update with data from server

      // Update the isActive state after the successful API call
      setIsActive((prevIsActive) => !prevIsActive);
      console.log('Status updated successfully:', updatedSiteFromServer);
    } catch (error) {
      alert('Error updating status. Please try again.');

      // Revert to the previous state if there's an error
      setIsActive(previousIsActive);
    } finally {
      setUpdating(false);
    }
  };

  if (!data) {
    return (
      <div className={styles.pane}>
        <p>Loading site details...</p>
      </div>
    );
  }

  return (
    <div className={`${styles.pane} ${isPWA ? styles.mobile : ''}`}>
      <h1>{data.name}</h1>
      <div className={styles.content}>
        <div className={styles.infoBlock}>
          <div className={`${styles.status} ${styles.row}`}>
            <span className={styles.statusName}>Active</span>
            <span className={styles.statusValue}>
              <label className={styles.toggleSwitch}>
                <input
                  type='checkbox'
                  checked={isActive}
                  onChange={handleToggleChange}
                  disabled={updating}
                />
                <span className={styles.slider}></span>
              </label>
            </span>
          </div>

          <div className={styles.row}>
            <PaneInfoPiece name='Safety Score' value={data.safetyScore} />
            <PaneInfoPiece
              name='Duration'
              value={
                data && data.duration && typeof data.duration === 'object' ? (
                  <Duration
                    hours={data.duration.hours}
                    minutes={data.duration.minutes}
                    seconds={data.duration.seconds}
                    size='small'
                  />
                ) : (
                  'Loading duration...'
                )
              }
            />
          </div>
          <div className={styles.row}>
            <PaneInfoPiece name='Total Incidents' value={data.totalIncidents} />
            <PaneInfoPiece
              name='Critical Incidents'
              value={data.criticalIncidents}
            />
          </div>
        </div>
        <div className={styles.snapshotGallery}>
          <h2>Snapshot Gallery</h2>
          {data.snapshots ? (
            data.snapshots.map((snapshot, index) => (
              <img
                key={index}
                src={snapshot}
                alt={`Snapshot ${index + 1}`}
                className={styles.snapshotImage}
              />
            ))
          ) : (
            <p>No snapshots available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
