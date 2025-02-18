import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import styles from './TimelineSessions.module.css';

export default function TimelineSessions() {
  const { setPaneData, setIsPaneOpen, isPaneOpen } = useOutletContext();
  const [sessionData, setSessionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  useEffect(() => {
    if (!isPaneOpen) {
      setSelectedSessionId(null); // Clear selection when pane closes
    }
  }, [isPaneOpen]);

  // CODE TO FETCH
  // useEffect(() => {
  //   const fetchSessions = async () => {
  //     try {
  //       const response = await fetch('/api/sessions');
  //       const data = await response.json();
  //       setSessionData(data);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error('Error fetching sessions:', error);
  //     }
  //   };

  //   fetchSessions();
  // }, []);

  // PALCEHOLDER DATA
  useEffect(() => {
    const fetchedData = [
      {
        sessionId: 'S0028',
        safetyScore: '87.5',
        mode: 'General',
        startTime: '2024-12-20 15:40:34',
        endTime: '2024-12-20 17:32:18',
      },
      {
        sessionId: 'S0027',
        safetyScore: '86.2',
        mode: 'Height',
        startTime: '2024-12-20 14:30:24',
        endTime: '2024-12-20 15:40:33',
      },
      {
        sessionId: 'S0026',
        safetyScore: '90.1',
        mode: 'Entry',
        startTime: '2024-12-20 14:04:02',
        endTime: '2024-12-20 14:04:02',
      },
      {
        sessionId: 'S0025',
        safetyScore: '82',
        mode: 'General',
        startTime: '2024-12-19 15:40:34',
        endTime: '2024-12-19 17:32:18',
      },
      {
        sessionId: 'S0024',
        safetyScore: '87.4',
        mode: 'Entry',
        startTime: '2024-12-19 14:30:24',
        endTime: '2024-12-19 15:40:33',
      },
      {
        sessionId: 'S0023',
        safetyScore: '89.8',
        mode: 'Entry',
        startTime: '2024-12-19 15:40:34',
        endTime: '2024-12-19 17:32:18',
      },
      {
        sessionId: 'S0022',
        safetyScore: '91.3',
        mode: 'Workshop',
        startTime: '2024-12-18 14:04:02',
        endTime: '2024-12-18 14:30:23',
      },
      {
        sessionId: 'S0021',
        safetyScore: '86',
        mode: 'General',
        startTime: '2024-12-17 14:04:02',
        endTime: '2024-12-17 14:30:23',
      },
      {
        sessionId: 'S0020',
        safetyScore: '84.4',
        mode: 'General',
        startTime: '2024-12-16 14:30:24',
        endTime: '2024-12-16 15:40:33',
      },
      {
        sessionId: 'S0019',
        safetyScore: '84.4',
        mode: 'Height',
        startTime: '2024-12-15 14:30:24',
        endTime: '2024-12-15 15:40:33',
      },
      {
        sessionId: 'S0018',
        safetyScore: '83.7',
        mode: 'General',
        startTime: '2024-12-15 14:04:02',
        endTime: '2024-12-15 14:30:23',
      },
      {
        sessionId: 'S0017',
        safetyScore: '83.3',
        mode: 'General',
        startTime: '2024-12-15 14:31:00',
        endTime: '2024-12-15 17:32:34',
      },
      {
        sessionId: 'S0016',
        safetyScore: '81.6',
        mode: 'Entry',
        startTime: '2024-12-14 08:32:34',
        endTime: '2024-12-14 10:45:18',
      },
      {
        sessionId: 'S0015',
        safetyScore: '85.2',
        mode: 'General',
        startTime: '2024-12-14 07:41:59',
        endTime: '2024-12-14 08:32:34',
      },
      {
        sessionId: 'S0014',
        safetyScore: '85.2',
        mode: 'General',
        startTime: '2024-12-14 07:41:59',
        endTime: '2024-12-14 08:32:34',
      },
      {
        sessionId: 'S0013',
        safetyScore: '84.2',
        mode: 'General',
        startTime: '2024-12-14 07:41:59',
        endTime: '2024-12-14 08:32:34',
      },
      {
        sessionId: 'S0012',
        safetyScore: '83.1',
        mode: 'General',
        startTime: '2024-12-14 07:41:59',
        endTime: '2024-12-14 08:32:34',
      },
      {
        sessionId: 'S0011',
        safetyScore: '84.8',
        mode: 'General',
        startTime: '2024-12-14 07:41:59',
        endTime: '2024-12-14 08:32:34',
      },
    ];
    setSessionData(fetchedData);
    setLoading(false);
  }, []);

  // CODE TO FETCH
  // const handleSessionClick = async (id) => {
  //   if (selectedSessionId === id) {
  //     setIsPaneOpen((prevState) => {
  //       const newState = !prevState;
  //       if (!newState) setSelectedSessionId(null);
  //       return newState;
  //     });
  //   } else {
  //     setSelectedSessionId(id);

  //     try {
  //       // Fetch detailed session data dynamically
  //       const response = await fetch(`/api/sessions/${id}`);
  //       const sessionDetails = await response.json();

  //       if (sessionDetails) {
  //         setPaneData(sessionDetails);
  //         setIsPaneOpen(true);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching session details:', error);
  //     }
  //   }
  // };

  // PLACEHOLDER DATA

  const placeholderSessionData = {
    constructionSites: [
      { id: 1, name: 'Riverside Apartments Project' },
      { id: 2, name: 'Hilltop Heights Construction' },
      { id: 3, name: 'Downtown Mall Construction' },
      { id: 4, name: 'Northside Office Tower' },
      { id: 5, name: 'Westside Residential Complex' },
      { id: 6, name: 'Eastside Industrial Park' },
      { id: 7, name: 'Southside Stadium Renovation' },
    ],
    cameras: [
      { id: 1, name: 'DJI Matrice 300 RTK' },
      { id: 2, name: 'FLIR Quasar 4K IR PTZ' },
      { id: 3, name: 'Axis P1448-LE' },
      { id: 4, name: 'Anafi USA' },
      { id: 5, name: 'Autel Robotics EVO II Pro' },
      { id: 6, name: 'Skydio 2+' },
      { id: 7, name: 'Bosch FLEXIDOME IP starlight 8000i' },
      { id: 8, name: 'Hikvision DS-2CD2387G2-LU' },
      { id: 9, name: 'DJI Inspire 3' },
      { id: 10, name: 'Sony SNC-VM772R' },
    ],
    sessionDetails: {
      sessionId: 'S0027',
      constructionSite: { id: 1, name: 'Riverside Apartments Project' }, // Updated to match expected structure
      camera: { id: 1, name: 'DJI Matrice 300 RTK' }, // Updated to match expected structure
      snapshots: [
        'https://picsum.photos/300/200?random=10',
        'https://picsum.photos/300/200?random=11',
        'https://picsum.photos/300/200?random=12',
      ],
      mode: 'General',
      duration: { hours: 1, minutes: 10, seconds: 9 },
      startTime: '2024-12-20T14:30:24Z',
      endTime: '2024-12-20T15:40:33Z',
      safetyScore: 87.5,
      progress: '+2.3%',
      totalIncidents: 12,
      criticalIncidents: 0,
      trends: [
        { time: '08:00', score: 86 },
        { time: '09:00', score: 86 },
        { time: '10:00', score: 85 },
        { time: '13:00', score: 86 },
        { time: '14:00', score: 87 },
        { time: '15:00', score: 88 },
        { time: '17:00', score: 89 },
      ],
      safetyScoreDistribution: {
        helmet: 86,
        footwear: 92,
        vest: 78,
      },
    },
  };

  // ALSO FOR PLACEHOLDER DATA

  const handleSessionClick = async (id) => {
    if (selectedSessionId === id) {
      setIsPaneOpen((prevState) => {
        const newState = !prevState;
        if (!newState) setSelectedSessionId(null);
        return newState;
      });
    } else {
      setSelectedSessionId(id);

      try {
        // Simulating API call with placeholder data
        setPaneData(placeholderSessionData);
        setIsPaneOpen(true);
      } catch (error) {
        console.error('Error fetching session details:', error);
      }
    }
  };

  return (
    <div className={styles.timelineSessions}>
      <h1>Sessions</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className={styles.sessionsTable}>
          <thead className={styles.tableHeader}>
            <tr className={styles.row}>
              <th>Session ID</th>
              {!isPaneOpen && (
                <>
                  <th>Safety Score</th>
                  <th>Mode</th>
                </>
              )}
              <th>Time</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {sessionData.map((session) => (
              <tr
                key={session.sessionId}
                className={`${styles.row} ${selectedSessionId === session.sessionId ? styles.active : ''}`}
                onClick={() => handleSessionClick(session.sessionId)}
              >
                <td className={styles.sessionId}>{session.sessionId}</td>
                {!isPaneOpen && (
                  <>
                    <td>{session.safetyScore}</td>
                    <td>{session.mode}</td>
                  </>
                )}
                <td>
                  <div className={styles.timeValues}>
                    <span>{session.startTime}</span>
                    <span>{session.endTime}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
