import React, { useState, useEffect } from 'react';
import styles from './ConstructionSites.module.css';
import { useApp } from '../context/AppContext';
import { useOutletContext } from 'react-router-dom';
import PlusIcon from '../components/icons/PlusIcon';
import DefaultImage from '../assets/DefaultImage.png';
import { formatDate, truncateText } from '../utils/helpers';
import axios from 'axios';

export default function ConstructionSites({ isPWA = false }) {
  const { setPaneData, setIsPaneOpen, isPaneOpen } = useOutletContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSiteId, setSelectedSiteId] = useState(null);
  const [isAddingNewSite, setIsAddingNewSite] = useState(false);
  const [newSiteName, setNewSiteName] = useState('');
  const [placeholder, setPlaceholder] = useState('Enter site name');
  const { isAdmin } = useApp();

  useEffect(() => {
    if (!isPaneOpen) {
      setSelectedSiteId(null); // Clear selection when pane closes
    }
  }, [isPaneOpen]);

  // Fetch construction sites data from the API
  const fetchConstructionSites = async () => {
    try {
      const response = await axios.get(
        'http://localhost:3000/api/construction-sites',
        {
          headers: {
            Accept: 'application/json', // Ensure the server knows we expect JSON
          },
        }
      );

      // Ensure the response data is an array
      if (Array.isArray(response.data)) {
        setData(response.data); // Set the data if it's an array
      } else {
        console.error('API response is not an array:', response.data);
        throw new Error('API response is not an array'); // Force fallback
      }
    } catch (error) {
      console.error('Error fetching construction sites:', error);
      // Fallback to placeholder data if API fails
      setData([
        {
          id: 1,
          name: 'Riverside Apartments Project',
          snapshots: [
            'https://picsum.photos/id/236/200/150',
            'https://picsum.photos/id/238/200/150',
            'https://picsum.photos/id/239/200/150',
          ],
          lastReport: '2025-01-01T03:21:00Z', //scan recent session and check which is the most recent for this construction site
          isActive: true, //updating function
          safetyscore: 92,
          duration: { hours: 8, minutes: 0, seconds: 0 },
          totalIncidents: 15,
          criticalIncidents: 3,
        },
        {
          id: 2,
          name: 'Hilltop Heights Construction',
          safetyscore: 85,
          duration: { hours: 10, minutes: 0, seconds: 0 },
          totalIncidents: 20,
          criticalIncidents: 5,
        },
        {
          id: 3,
          name: 'Downtown Mall Construction',
          snapshots: [
            'https://picsum.photos/id/243/200/150',
            'https://picsum.photos/id/244/200/150',
            'https://picsum.photos/id/245/200/150',
          ],
          lastReport: '2024-12-31T05:11:00Z',
          isActive: true,
          safetyscore: 98,
          duration: { hours: 12, minutes: 0, seconds: 0 },
          totalIncidents: 10,
          criticalIncidents: 1,
        },
        {
          id: 4,
          name: 'Northside Office Tower',
          snapshots: [
            'https://picsum.photos/id/247/200/150',
            'https://picsum.photos/id/248/200/150',
          ],
          lastReport: '2024-12-29T10:55:00Z',
          isActive: false,
          safetyscore: 88,
          duration: { hours: 6, minutes: 30, seconds: 0 },
          totalIncidents: 8,
          criticalIncidents: 2,
        },
        {
          id: 5,
          name: 'Westside Residential Complex',
          lastReport: '2024-12-28T15:33:00Z',
          isActive: true,
          safetyscore: 95,
          duration: { hours: 9, minutes: 0, seconds: 0 },
          totalIncidents: 12,
          criticalIncidents: 0,
        },
        {
          id: 6,
          name: 'Eastside Industrial Park',
          snapshots: ['https://picsum.photos/id/250/200/150'],
          lastReport: '2024-12-27T11:21:00Z',
          isActive: true,
          safetyscore: 90,
          duration: { hours: 7, minutes: 45, seconds: 0 },
          totalIncidents: 5,
          criticalIncidents: 1,
        },
        {
          id: 7,
          name: 'Southside Stadium Renovation',
          lastReport: '2024-12-26T08:15:00Z',
          isActive: false,
          safetyscore: 82,
          duration: { hours: 11, minutes: 0, seconds: 0 },
          totalIncidents: 18,
          criticalIncidents: 4,
        },
      ]);
    } finally {
      setLoading(false); // Ensure loading is set to false after the API call
    }
  };

  useEffect(() => {
    fetchConstructionSites(); // Fetch data on component mount
  }, []);

  // Handle site click
  const handleSiteClick = (id) => {
    console.log('Site clicked:', id);
    if (selectedSiteId === id) {
      setIsPaneOpen((prevState) => {
        const newState = !prevState;
        if (!newState) setSelectedSiteId(null);
        return newState;
      });
    } else {
      setSelectedSiteId(id);

      // Simulate fetching detailed site data
      const siteDetails = data.find((site) => site.id === id);
      if (siteDetails) {
        console.log('Setting pane data:', siteDetails);
        setPaneData(siteDetails);
        setIsPaneOpen(true);
      }
    }
  };

  // Function to handle adding a new site
  const handleAddSite = async () => {
    if (isAddingNewSite) {
      // Submit new site
      if (newSiteName.trim() !== '') {
        try {
          // Send only the site name as a URL parameter
          const response = await axios.post(
            `http://localhost:3000/api/construction-sites/${newSiteName.trim()}`
          );
          if (response.data) {
            setData((prevData) => [...prevData, response.data]); // Add new site to the array
            setNewSiteName('');
            setIsAddingNewSite(false);
          }
        } catch (error) {
          console.error('Error adding site:', error);
          setPlaceholder('Failed to add site');
        }
      } else {
        setNewSiteName('');
        setPlaceholder('Site name cannot be empty');
      }
    } else {
      setIsAddingNewSite(true);
    }
  };

  // Function to handle deleting a site
  const handleDeleteSite = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/construction-sites/${id}`);
      setData((prevData) => prevData.filter((site) => site.id !== id));
    } catch (error) {
      console.error('Error deleting site:', error);
    }
  };

  return (
    <div
      className={`${styles.constructionSites} ${isPaneOpen ? styles.paneOpen : ''} ${isPWA ? styles.mobile : ''}`}
    >
      <h1>Construction Sites</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.sitesContent}>
          <div
            className={`${styles.addSiteContainer} ${isPaneOpen ? styles.paneOpen : ''}`}
          >
            {isAddingNewSite ? (
              <>
                <input
                  type='text'
                  value={newSiteName}
                  onChange={(e) => setNewSiteName(e.target.value)}
                  placeholder={placeholder}
                />
                <button
                  className={`${styles.addSiteToggle} ${styles.addSiteButton}`}
                  onClick={handleAddSite}
                >
                  <PlusIcon className={styles.addIcon} />
                </button>
                <button
                  className={styles.addSiteToggle}
                  onClick={() => {
                    setIsAddingNewSite(false);
                    setPlaceholder('Enter site name');
                    setNewSiteName('');
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button className={styles.addSiteToggle} onClick={handleAddSite}>
                <PlusIcon className={styles.addIcon} />
                Add Site
              </button>
            )}
          </div>
          <div className={styles.sitesList}>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((site) => (
                <div
                  key={site.id}
                  className={`${styles.row} ${selectedSiteId === site.id ? styles.active : ''} ${isPaneOpen ? styles.paneOpen : ''}`}
                  onClick={() => handleSiteClick(site.id)}
                >
                  <div className={styles.img}>
                    {site.snapshots && site.snapshots.length > 0 ? (
                      <img
                        src={site.snapshots[0]}
                        alt=''
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DefaultImage;
                        }}
                      />
                    ) : (
                      <img src={DefaultImage} alt='Default' />
                    )}
                  </div>
                  <div className={styles.desc}>
                    <div className={styles.siteName}>
                      {isPWA ? (
                        truncateText(site.name, 21)
                      ) : (
                        <>
                          {site.name}
                          <span
                            className={`${styles.statusBadge} ${styles[site.isActive ? 'active' : 'inactive']}`}
                          >
                            {site.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </>
                      )}
                    </div>
                    <div className={styles.time}>
                      {site.lastReport
                        ? `Last report: ${formatDate(site.lastReport)}`
                        : 'No records yet'}
                    </div>
                    {isPWA && !site.isActive && (
                      <span
                        className={`${styles.statusBadge} ${styles[site.isActive ? 'active' : 'inactive']}`}
                      >
                        {site.isActive ? 'Active' : 'Inactive'}
                      </span>
                    )}
                  </div>
                  <div className={styles.delete}>
                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSite(site.id);
                        }}
                      >
                        <svg
                          width='16'
                          height='19'
                          viewBox='0 0 16 19'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M3 18.5C2.45 18.5 1.97917 18.3042 1.5875 17.9125C1.19583 17.5208 1 17.05 1 16.5V3.5H0V1.5H5V0.5H11V1.5H16V3.5H15V16.5C15 17.05 14.8042 17.5208 14.4125 17.9125C14.0208 18.3042 13.55 18.5 13 18.5H3ZM13 3.5H3V16.5H13V3.5ZM5 14.5H7V5.5H5V14.5ZM9 14.5H11V5.5H9V14.5Z'
                            fill='var(--secondary)'
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No construction sites available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
