import React, { useState, useEffect } from 'react';
import styles from './ConstructionSites.module.css';
import { useOutletContext } from 'react-router-dom';
import PlusIcon from '../components/icons/PlusIcon';
import DefaultImage from '../assets/DefaultImage.png';

export default function ConstructionSites() {
  const { setPaneData, setIsPaneOpen, isPaneOpen } = useOutletContext();
  const [data, setData] = useState({ sites: [] });
  const [loading, setLoading] = useState(true);
  const [selectedSiteId, setSelectedSiteId] = useState(null);
  const [isAddingNewSite, setIsAddingNewSite] = useState(false);
  const [newSiteName, setNewSiteName] = useState('');
  const [placeholder, setPlaceholder] = useState('Enter site name'); // Placeholder as state

  // Helper function to format date and time as "31st December 3:46 PM"
  const formatDateTime = (dateString) => {
    if (!dateString) return nul;
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const daySuffix = getDaySuffix(day);
    const time = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${day}${daySuffix} ${month} ${time}`;
  };

  useEffect(() => {
    if (!isPaneOpen) {
      setSelectedSiteId(null); // Clear selection when pane closes
    }
  }, [isPaneOpen]);

  // Helper function to get the suffix for the day (st, nd, rd, th)
  const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return 'th'; // 11th, 12th, 13th, etc.
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  // Handle site click
  const handleSiteClick = (id) => {
    console.log('Site clicked:', id); // Debugging
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
        console.log('Setting pane data:', siteDetails); // Debugging
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
        // Prevent adding empty names
        const newSite = {
          id: data.length + 1, // In a real app, the ID should be generated by the backend
          name: newSiteName.trim(),
          snapshots: [], // No images by default
          lastReport: null, // No timestamp by default
          isActive: true,
          totalIncidents: 0,
          criticalIncidents: 0,
        };

        try {
          // Simulate API call to add site (replace with your actual API call)
          const response = await fetch('/api/addSite', {
            // Replace with your API endpoint
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newSite),
          });

          if (response.ok) {
            setData((prevData) => ({
              ...prevData,
              sites: [...prevData.sites, newSite],
            }));
            setNewSiteName(''); // Clear input field
            setIsAddingNewSite(false); // Hide input field
          } else {
            console.error('Failed to add site:', response.status); // Log the actual error
            // Handle error, maybe display a message to the user
          }
        } catch (error) {
          console.error('Error adding site:', error);
          // Handle error
        }
      } else {
        setNewSiteName('');
        setPlaceholder('Site name cannot be empty'); // Set error placeholder
      }
    } else {
      setIsAddingNewSite(true); // Show input field
    }
  };

  // Function to handle deleting a site
  const handleDeleteSite = async (id) => {
    try {
      // Simulate API call to delete site
      const response = await fetch(`/api/deleteSite/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setData((prevData) => ({
          ...prevData,
          sites: prevData.sites.filter((site) => site.id !== id),
        }));
      } else {
        console.error('Failed to delete site');
      }
    } catch (error) {
      console.error('Error deleting site:', error);
    }
  };

  // PLACEHOLDER DATA
  useEffect(() => {
    const fetchedData = [
      {
        id: 1,
        name: 'Riverside Apartments Project',
        snapshots: [
          'https://picsum.photos/id/237/200/150',
          'https://picsum.photos/id/238/200/150',
          'https://picsum.photos/id/239/200/150',
        ],
        lastReport: '2025-01-01T03:21:00Z',
        isActive: true,
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
    ];
    setData(fetchedData);
    setLoading(false);
  }, []);

  return (
    <div
      className={`${styles.constructionSites} ${isPaneOpen ? styles.paneOpen : ''}`}
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
                    setPlaceholder('Enter site name'); // Reset on cancel
                    setNewSiteName(''); // Clear input on cancel
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
            {data.map((site) => (
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
                    {site.name}
                    <span
                      className={styles[site.isActive ? 'active' : 'inactive']}
                    >
                      {site.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className={styles.time}>
                    {site.lastReport
                      ? `Last report: ${formatDateTime(site.lastReport)}`
                      : 'No records yet'}
                  </div>
                </div>
                <div className={styles.delete}>
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
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
