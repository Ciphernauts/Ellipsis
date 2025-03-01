import { useState, useEffect } from 'react';
import styles from './Cameras.module.css';
import DroneIcon from '../components/icons/DroneIcon';
import CameraIcon from '../components/icons/CameraIcon';
import TickIcon from '../components/icons/TickIcon';
import ConnectIcon from '../components/icons/ConnectIcon';
import PlusIcon from '../components/icons/PlusIcon';

export default function Cameras() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddingDevice, setIsAddingDevice] = useState(false);
  const [availableDevices, setAvailableDevices] = useState([]);
  const [devicesLoading, setDevicesLoading] = useState(false);

  // PLACEHOLDER DATA
  useEffect(() => {
    const fetchedData = [
      {
        id: 1,
        name: 'DJI Matrice 300 RTK',
        type: 'drone',
        isOnline: true,
        lastSyncedDate: '2025-01-01T14:00:00',
        isConnected: true,
      },
      {
        id: 2,
        name: 'FLIR Quasar 4K IR PTZ',
        type: 'camera',
        isOnline: true,
        lastSyncedDate: null,
        isConnected: true,
      },
      {
        id: 3,
        name: 'Axis P1448-LE',
        type: 'camera',
        isOnline: true,
        lastSyncedDate: '2025-01-01T14:00:00',
        isConnected: false,
      },
      {
        id: 4,
        name: 'Anali USA',
        type: 'camera',
        isOnline: true,
        lastSyncedDate: '2025-01-01T14:00:00',
        isConnected: false,
      },
      {
        id: 5,
        name: 'Auto! Robotics EVO II Pro',
        type: 'drone',
        isOnline: false,
        lastSyncedDate: '2025-01-01T14:00:00',
        isConnected: false,
      },
      {
        id: 6,
        name: 'Skydio 2+',
        type: 'drone',
        isOnline: false,
        lastSyncedDate: '2025-01-01T14:00:00',
        isConnected: false,
      },
      {
        id: 7,
        name: 'Bosch FLEXIDOME IP starlight 8000i',
        type: 'camera',
        isOnline: false,
        lastSyncedDate: '2025-01-01T14:00:00',
        isConnected: false,
      },
      {
        id: 8,
        name: 'Hikvision DS-2CD2387G2-LU',
        type: 'camera',
        isOnline: false,
        lastSyncedDate: '2025-01-01T14:00:00',
        isConnected: false,
      },
      {
        id: 9,
        name: 'DJI Inspire 3',
        type: 'drone',
        isOnline: false,
        lastSyncedDate: '2025-01-01T14:00:00',
        isConnected: false,
      },
      {
        id: 10,
        name: 'Sony SNC-VM772R',
        type: 'camera',
        isOnline: false,
        lastSyncedDate: '2025-01-01T14:00:00',
        isConnected: false,
      },
    ];
    setData(fetchedData);
    setLoading(false);
  }, []);

  // Function to format date and time as "1st January 2025 2:02 PM"
  const formatDateTime = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const time = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${day}${getDaySuffix(day)} ${month} ${year} ${time}`;
  };

  // Helper function to get the suffix for the day (st, nd, rd, th)
  const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
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

  // Function to fetch available devices
  const fetchAvailableDevices = async () => {
    setDevicesLoading(true);
    // Simulate API call to fetch available devices
    const fetchedDevices = [
      {
        id: 11,
        name: 'Pelco Spectra 7 PTZ',
        type: 'camera',
        status: 'Ready to pair',
      },
      {
        id: 12,
        name: 'Yuneec H520E',
        type: 'drone',
        status: 'Ready to pair',
      },
      {
        id: 13,
        name: 'Freefly Alta X',
        type: 'drone',
        status: 'Connecting...',
      },
      {
        id: 14,
        name: 'Hikvision DS-2CD2387G...',
        type: 'camera',
        status: 'Connecting...',
      },
    ];
    setAvailableDevices(fetchedDevices);
    setDevicesLoading(false);
  };

  // Function to handle adding a new device
  const handleAddDevice = () => {
    setIsAddingDevice(true);
    fetchAvailableDevices();
  };

  return (
    <div className={styles.cameras}>
      <h1>Cameras</h1>
      <div className={styles.heading}>
        <h2>Paired Devices</h2>
        <div className={styles.addDeviceContainer}>
          <button className={styles.addDeviceButton} onClick={handleAddDevice}>
            <PlusIcon />
            Add Device
          </button>
          {isAddingDevice && (
            <div className={styles.dropdown}>
              {devicesLoading ? (
                <p>Loading available devices...</p>
              ) : (
                availableDevices.map((device) => (
                  <div key={device.id} className={styles.dropdownItem}>
                    <div className={styles.deviceName}>{device.name}</div>
                    <div className={styles.deviceType}>{device.type}</div>
                    <div className={styles.deviceStatus}>{device.status}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      <div className={styles.content}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          data.map((camera) => (
            <div key={camera.id} className={styles.row}>
              <div className={styles.icon}>
                {camera.type === 'drone' ? <DroneIcon /> : <CameraIcon />}
              </div>
              <div className={styles.name}>{camera.name}</div>
              <div className={styles.status}>
                <span
                  className={
                    camera.isOnline ? styles.onlineDot : styles.offlineDot
                  }
                />
                <span className={styles.statusText}>
                  {camera.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className={styles.lastSynced}>
                {camera.lastSyncedDate
                  ? formatDateTime(camera.lastSyncedDate)
                  : 'Not synced'}
              </div>
              <div className={styles.connectButtonContainer}>
                {camera.isConnected ? (
                  <button className={styles.connectButton}>
                    <TickIcon />
                    Connected
                  </button>
                ) : (
                  <button className={styles.connectedButton}>
                    <ConnectIcon />
                    Connect
                  </button>
                )}
              </div>
              <div className={styles.delete}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle delete functionality here
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
          ))
        )}
      </div>
    </div>
  );
}
