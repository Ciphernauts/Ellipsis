import React, { useState, useEffect } from 'react';
import styles from './Snapshots.module.css'; // Importing CSS Module

const Snapshots = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Simulated API response
    const fetchData = async () => {
      const data = {
        images: [
          {
            id: 'img_001',
            url: 'https://picsum.photos/284/129',
            metadata: { description: 'Top Image' },
          },
          {
            id: 'img_002',
            url: 'https://picsum.photos/142/129',
            metadata: { description: 'Bottom Left Image' },
          },
          {
            id: 'img_003',
            url: 'https://picsum.photos/143/129',
            metadata: { description: 'Bottom Right Image' },
          },
        ],
      };
      setImages(data.images);
    };

    fetchData();
  }, []);

  return (
    <div className={`${'dashboardCard'} ${styles.card}`}>
      <h2>Snapshots</h2>
      <div className={styles.images}>
        <img
          src={images[0]?.url}
          alt={images[0]?.metadata.description}
          className={styles.topImage}
        />
        <div className={styles.bottomRow}>
          <img
            src={images[1]?.url}
            alt={images[1]?.metadata.description}
            className={styles.bottomLeftImage}
          />
          <img
            src={images[2]?.url}
            alt={images[2]?.metadata.description}
            className={styles.bottomRightImage}
          />
        </div>
      </div>
    </div>
  );
};

export default Snapshots;
