import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import styles from './IncidentHistory.module.css';
import DefaultImage from '../assets/DefaultImage.png';

export default function IncidentHistory() {
  const { setPaneData, setIsPaneOpen, isPaneOpen } = useOutletContext();
  const [data, setData] = useState({ incidents: [], filters: {} });
  const [loading, setLoading] = useState(true);
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);
  const [filters, setFilters] = useState({
    constructionSite: 'All',
    date: '',
    incident: 'All',
    severity: 'All',
  });

  useEffect(() => {
    if (!isPaneOpen) {
      setSelectedIncidentId(null); // Clear selection when pane closes
    }
  }, [isPaneOpen]);

  // Helper function to format time as HH:MM am/pm
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Helper function to format date as "31st December 2024"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const daySuffix = getDaySuffix(day);
    return `${day}${daySuffix} ${month} ${year}`;
  };

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

  // Handle incident click
  const handleIncidentClick = (id) => {
    console.log('Incident clicked:', id); // Debugging
    if (selectedIncidentId === id) {
      setIsPaneOpen((prevState) => {
        const newState = !prevState;
        if (!newState) setSelectedIncidentId(null);
        return newState;
      });
    } else {
      setSelectedIncidentId(id);

      // Simulate fetching detailed incident data
      const incidentDetails = data.incidents.find(
        (incident) => incident.id === id
      );
      if (incidentDetails) {
        console.log('Setting pane data:', incidentDetails); // Debugging
        setPaneData(incidentDetails);
        setIsPaneOpen(true);
      }
    }
  };
  // PLACEHOLDER DATA
  useEffect(() => {
    const fetchedData = {
      incidents: [
        {
          id: 1,
          name: 'Missing helmet',
          snapshot: 'https://picsum.photos/id/237/200/150',
          site: 'Riverside Apartments Project',
          time: '2025-01-01T03:21:00Z',
          status: 'Open',
          isCritical: false,
          sessionId: 'S0001',
          mode: 'General',
          device: { name: 'Camera Model A', type: 'camera' },
        },
        {
          id: 2,
          name: 'Improper footwear',
          snapshot: 'https://picsum.photos/id/238/200/150',
          site: 'Hilltop Heights Construction',
          time: '2024-12-31T05:34:00Z',
          status: 'Resolved',
          isCritical: false,
          sessionId: 'S0002',
          mode: 'Entry',
          device: { name: 'Drone Model X', type: 'drone' },
        },
        {
          id: 3,
          name: 'Improper scaffolding',
          snapshot: 'https://picsum.photos/id/239/200/150',
          site: 'Downtown Mall Construction',
          time: '2024-12-31T05:11:00Z',
          status: 'Open',
          isCritical: false,
          sessionId: 'S0003',
          mode: 'Workshop',
          device: { name: 'Camera Model B', type: 'camera' },
        },
        {
          id: 4,
          name: 'Falling worker',
          site: 'Hilltop Heights Construction',
          time: '2024-12-31T04:49:00Z',
          status: 'Open',
          isCritical: true,
          sessionId: 'S0004',
          mode: 'Height',
          device: { name: 'Drone Model Y', type: 'drone' },
        },
        {
          id: 5,
          name: 'Missing harness',
          snapshot: 'https://picsum.photos/id/241/200/150',
          site: 'Riverside Apartments Project',
          time: '2024-12-31T04:12:00Z',
          status: 'Resolved',
          isCritical: false,
          sessionId: 'S0005',
          mode: 'General',
          device: { name: 'Camera Model A', type: 'camera' },
        },
        {
          id: 6,
          name: 'Missing vest',
          snapshot: 'https://picsum.photos/id/242/200/150',
          site: 'Cedar Lane Residences',
          time: '2024-12-31T11:59:00Z',
          status: 'Resolved',
          isCritical: false,
          sessionId: 'S0006',
          mode: 'Entry',
          device: { name: 'Drone Model X', type: 'drone' },
        },
        {
          id: 7,
          name: 'Missing helmet',
          snapshot: 'https://picsum.photos/id/243/200/150',
          site: 'Cedar Lane Residences',
          time: '2024-12-31T11:45:00Z',
          status: 'Resolved',
          isCritical: false,
          sessionId: 'S0007',
          mode: 'Workshop',
          device: { name: 'Camera Model B', type: 'camera' },
        },
        {
          id: 8,
          name: 'Improper scaffolding',
          snapshot: 'https://picsum.photos/id/244/200/150',
          site: 'Downtown Mall Construction',
          time: '2024-12-30T04:30:00Z',
          status: 'False Alarm',
          isCritical: false,
          sessionId: 'S0008',
          mode: 'Height',
          device: { name: 'Drone Model Y', type: 'drone' },
        },
        {
          id: 9,
          name: 'Missing vest',
          snapshot: 'https://picsum.photos/id/245/200/150',
          site: 'Cedar Lane Residences',
          time: '2024-12-30T11:59:00Z',
          status: 'Resolved',
          isCritical: false,
          sessionId: 'S0009',
          mode: 'General',
          device: { name: 'Camera Model A', type: 'camera' },
        },
        {
          id: 10,
          name: 'Missing gloves',
          snapshot: 'https://picsum.photos/id/246/200/150',
          site: 'Riverside Apartments Project',
          time: '2024-12-29T08:18:00Z',
          status: 'Open',
          isCritical: false,
          sessionId: 'S0010',
          mode: 'Entry',
          device: { name: 'Drone Model X', type: 'drone' },
        },
        {
          id: 11,
          name: 'Improper footwear',
          snapshot: 'https://picsum.photos/id/247/200/150',
          site: 'Skyscraper Construction',
          time: '2024-12-28T09:25:00Z',
          status: 'Open',
          isCritical: false,
          sessionId: 'S0011',
          mode: 'Workshop',
          device: { name: 'Camera Model B', type: 'camera' },
        },
        {
          id: 12,
          name: 'Missing helmet',
          snapshot: 'https://picsum.photos/id/248/200/150',
          site: 'Luxury Condos Project',
          time: '2024-12-27T14:50:00Z',
          status: 'Resolved',
          isCritical: false,
          sessionId: 'S0012',
          mode: 'Height',
          device: { name: 'Drone Model Y', type: 'drone' },
        },
        {
          id: 13,
          name: 'Improper scaffolding',
          snapshot: 'https://picsum.photos/id/249/200/150',
          site: 'Industrial Warehouse',
          time: '2024-12-26T17:15:00Z',
          status: 'Open',
          isCritical: false,
          sessionId: 'S0013',
          mode: 'General',
          device: { name: 'Camera Model A', type: 'camera' },
        },
        {
          id: 14,
          name: 'Fire hazard',
          snapshot: 'https://picsum.photos/id/250/200/150',
          site: 'Commercial Building',
          time: '2024-12-25T20:40:00Z',
          status: 'Resolved',
          isCritical: true,
          sessionId: 'S0014',
          mode: 'Entry',
          device: { name: 'Drone Model X', type: 'drone' },
        },
        {
          id: 15,
          name: 'Missing harness',
          snapshot: 'https://picsum.photos/id/251/200/150',
          site: 'Residential Complex',
          time: '2024-12-24T23:05:00Z',
          status: 'Open',
          isCritical: false,
          sessionId: 'S0015',
          mode: 'Workshop',
          device: { name: 'Camera Model B', type: 'camera' },
        },
        {
          id: 16,
          name: 'Missing guardrails',

          snapshot: 'https://picsum.photos/id/252/200/150',
          site: 'Historical Landmark',
          time: '2024-12-23T02:30:00Z',
          status: 'Resolved',
          isCritical: false,
          sessionId: 'S0016',
          mode: 'Height',
          device: { name: 'Drone Model Y', type: 'drone' },
        },
      ],
      filters: {
        constructionSite: [
          'All',
          'Riverside Apartments Project',
          'Hilltop Heights Construction',
          'Downtown Mall Construction',
          'Cedar Lane Residences',
        ],
        incident: [
          'All',
          'Missing helmet',
          'Improper footwear',
          'Improper scaffolding',
          'Falling worker',
          'Missing harness',
          'Missing vest',
          'Missing guardrails',
        ],
        severity: ['All', 'Moderate', 'Critical'],
      },
    };
    setData(fetchedData);
    setLoading(false);
  }, []);

  const handleFilterChange = (filterType, value) => {
    setFilters({ ...filters, [filterType]: value });
  };

  const filteredIncidents = data.incidents.filter((incident) => {
    return (
      (filters.constructionSite === 'All' ||
        incident.site === filters.constructionSite) &&
      (filters.date === '' ||
        new Date(incident.time).toLocaleDateString() ===
          new Date(filters.date).toLocaleDateString()) &&
      (filters.incident === 'All' || incident.name === filters.incident) &&
      (filters.severity === 'All' ||
        (filters.severity === 'Critical'
          ? incident.isCritical
          : !incident.isCritical))
    );
  });

  return (
    <div
      className={`${styles.incidentHistory} ${isPaneOpen ? styles.paneOpen : ''}`}
    >
      <h1>Incident History</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.incidentsContent}>
          <div
            className={`${styles.filters} ${isPaneOpen ? styles.paneOpen : ''}`}
          >
            <div className={styles.filterGroup}>
              <label htmlFor='constructionSite'>Construction Site</label>
              <select
                id='constructionSite'
                value={filters.constructionSite}
                onChange={(e) =>
                  handleFilterChange('constructionSite', e.target.value)
                }
              >
                {data.filters.constructionSite.map((site) => (
                  <option key={site} value={site}>
                    {site}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor='date'>Date</label>
              <input
                id='date'
                type='date'
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
              />
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor='incident'>Incident</label>
              <select
                id='incident'
                value={filters.incident}
                onChange={(e) => handleFilterChange('incident', e.target.value)}
              >
                {data.filters.incident.map((incident) => (
                  <option key={incident} value={incident}>
                    {incident}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor='severity'>Severity</label>
              <select
                id='severity'
                value={filters.severity}
                onChange={(e) => handleFilterChange('severity', e.target.value)}
              >
                {data.filters.severity.map((severity) => (
                  <option key={severity} value={severity}>
                    {severity}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.incidentsList}>
            {filteredIncidents.map((incident) => (
              <div
                key={incident.id}
                className={`${styles.row} ${selectedIncidentId === incident.id ? styles.active : ''} ${incident.isCritical ? styles.critical : ''}`}
                onClick={() => handleIncidentClick(incident.id)}
              >
                <div className={styles.img}>
                  {incident.snapshot ? (
                    <img
                      src={incident.snapshot}
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
                  <div
                    className={`${styles.incidentName} ${isPaneOpen ? styles.paneOpen : ''}`}
                  >
                    {incident.name}
                    {incident.isCritical && (
                      <span className={styles.criticalBadge}>Critical</span>
                    )}
                  </div>
                  {!isPaneOpen && (
                    <div className={styles.site}>{incident.site}</div>
                  )}
                </div>
                <div
                  className={`${styles.details} ${isPaneOpen ? styles.paneOpen : ''}`}
                >
                  {incident.status && (
                    <span className={styles.status}>
                      <span
                        className={
                          styles[incident.status.toLowerCase().replace(' ', '')]
                        }
                      >
                        {incident.status}
                      </span>
                    </span>
                  )}
                  {incident.time && (
                    <>
                      <span className={styles.date}>
                        {formatDate(incident.time)}
                      </span>
                      <span className={styles.time}>
                        {formatTime(incident.time)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
