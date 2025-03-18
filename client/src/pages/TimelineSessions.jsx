import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import styles from './TimelineSessions.module.css';
import axios from 'axios'; // Import Axios

export default function TimelineSessions({ isPWA = false }) {
  const { setPaneData, isPaneOpen, setIsPaneOpen } = useOutletContext();
  const [sessionData, setSessionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  useEffect(() => {
    if (!isPaneOpen) {
      setSelectedSessionId(null); // Clear selection when pane closes
    }
  }, [isPaneOpen]);

  // Fetch sessions data from the API
  const fetchSessions = async () => {
    try {
      const response = await axios.get(
        'https://ellipsis-1.onrender.com/api/timeline/sessions'
      );

      if (response.data) {
        setSessionData(response.data);
      } else {
        throw new Error('No data returned from API');
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      // Fallback to placeholder data if API fails
      setSessionData({
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
        sessions: [
          {
            sessionid: 'S0028',
            safetyscore: '87.5',
            mode: 'General',
            starttime: '2024-12-20 15:40:34',
            endtime: '2024-12-20 17:32:18',
          },
          {
            sessionid: 'S0027',
            safetyscore: '86.2',
            mode: 'Height',
            starttime: '2024-12-20 14:30:24',
            endtime: '2024-12-20 15:40:33',
          },
          {
            sessionid: 'S0026',
            safetyscore: '90.1',
            mode: 'Entry',
            starttime: '2024-12-20 14:04:02',
            endtime: '2024-12-20 14:04:02',
          },
          {
            sessionid: 'S0025',
            safetyscore: '82',
            mode: 'General',
            starttime: '2024-12-19 15:40:34',
            endtime: '2024-12-19 17:32:18',
          },
          {
            sessionid: 'S0024',
            safetyscore: '87.4',
            mode: 'Entry',
            starttime: '2024-12-19 14:30:24',
            endtime: '2024-12-19 15:40:33',
          },
          {
            sessionid: 'S0023',
            safetyscore: '89.8',
            mode: 'Entry',
            starttime: '2024-12-19 15:40:34',
            endtime: '2024-12-19 17:32:18',
          },
          {
            sessionid: 'S0022',
            safetyscore: '91.3',
            mode: 'Workshop',
            starttime: '2024-12-18 14:04:02',
            endtime: '2024-12-18 14:30:23',
          },
          {
            sessionid: 'S0021',
            safetyscore: '86',
            mode: 'General',
            starttime: '2024-12-17 14:04:02',
            endtime: '2024-12-17 14:30:23',
          },
          {
            sessionid: 'S0020',
            safetyscore: '84.4',
            mode: 'General',
            starttime: '2024-12-16 14:30:24',
            endtime: '2024-12-16 15:40:33',
          },
          {
            sessionid: 'S0019',
            safetyscore: '84.4',
            mode: 'Height',
            starttime: '2024-12-15 14:30:24',
            endtime: '2024-12-15 15:40:33',
          },
          {
            sessionid: 'S0018',
            safetyscore: '83.7',
            mode: 'General',
            starttime: '2024-12-15 14:04:02',
            endtime: '2024-12-15 14:30:23',
          },
          {
            sessionid: 'S0017',
            safetyscore: '83.3',
            mode: 'General',
            starttime: '2024-12-15 14:31:00',
            endtime: '2024-12-15 17:32:34',
          },
          {
            sessionid: 'S0016',
            safetyscore: '81.6',
            mode: 'Entry',
            starttime: '2024-12-14 08:32:34',
            endtime: '2024-12-14 10:45:18',
          },
          {
            sessionid: 'S0015',
            safetyscore: '85.2',
            mode: 'General',
            starttime: '2024-12-14 07:41:59',
            endtime: '2024-12-14 08:32:34',
          },
          {
            sessionid: 'S0014',
            safetyscore: '85.2',
            mode: 'General',
            starttime: '2024-12-14 07:41:59',
            endtime: '2024-12-14 08:32:34',
          },
          {
            sessionid: 'S0013',
            safetyscore: '84.2',
            mode: 'General',
            starttime: '2024-12-14 07:41:59',
            endtime: '2024-12-14 08:32:34',
          },
          {
            sessionid: 'S0012',
            safetyscore: '83.1',
            mode: 'General',
            starttime: '2024-12-14 07:41:59',
            endtime: '2024-12-14 08:32:34',
          },
          {
            sessionid: 'S0011',
            safetyscore: '84.8',
            mode: 'General',
            starttime: '2024-12-14 07:41:59',
            endtime: '2024-12-14 08:32:34',
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions(); // Fetch data on component mount
  }, []);

  // Handle session click
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
        // Fetch detailed session data dynamically
        const response = await axios.get(
          `https://ellipsis-1.onrender.com/api/timeline/sessions/${id}`
        );
        const sessionDetails = response.data;
        console.log('Session details:', sessionDetails);

        if (sessionDetails) {
          setPaneData({
            ...sessionDetails,
            constructionSites: sessionData.constructionSites,
            cameras: sessionData.cameras,
          });
          setIsPaneOpen(true);
        }
      } catch (error) {
        console.error('Error fetching session details:', error);
        // Fallback to placeholder data if API fails
        const placeholderSessionDetails = {
          sessionid: 'S0027',
          constructionSite: { id: 1, name: 'Riverside Apartments Project' }, // Updated to match expected structure
          camera: { id: 1, name: 'DJI Matrice 300 RTK' }, // Updated to match expected structure
          snapshots: [
            'https://picsum.photos/300/200?random=10',
            'https://picsum.photos/300/200?random=11',
            'https://picsum.photos/300/200?random=12',
          ],
          mode: 'General',
          duration: { hours: 1, minutes: 10, seconds: 9 },
          starttime: '2024-12-20T14:30:24Z',
          endtime: '2024-12-20T15:40:33Z',
          safetyscore: 87.5,
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
        };

        setPaneData({
          sessiondetails: placeholderSessionDetails,
          constructionSites: sessionData.constructionSites,
          cameras: sessionData.cameras,
        });
        setIsPaneOpen(true);
      }
    }
  };

  return (
    <div className={`${styles.timelineSessions} ${isPWA ? styles.mobile : ''}`}>
      <h1>Sessions</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className={styles.sessionsTable}>
          <thead className={styles.tableHeader}>
            <tr className={styles.row}>
              <th>Session ID</th>
              {isPaneOpen ||
                (!isPWA && (
                  <>
                    <th>Safety Score</th>
                    {!isPWA && <th>Mode</th>}
                  </>
                ))}
              <th>Time</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {sessionData.sessions.length > 0 ? (
              sessionData.sessions.map((session) => (
                <tr
                  key={session.sessionid}
                  className={`${styles.row} ${selectedSessionId === session.sessionid ? styles.active : ''}`}
                  onClick={() => handleSessionClick(session.sessionid)}
                >
                  <td className={styles.sessionId}>{session.sessionid}</td>
                  {isPaneOpen ||
                    (!isPWA && (
                      <>
                        <td>{session.safetyscore}</td>
                        {!isPWA && <td>{session.mode}</td>}
                      </>
                    ))}
                  <td>
                    <div className={styles.timeValues}>
                      <span>{session.starttime}</span>
                      <span>{session.endtime}</span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={isPaneOpen || !isPWA ? (isPWA ? 2 : 4) : 2}
                  className={styles.noSessionsMessage}
                >
                  No sessions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
