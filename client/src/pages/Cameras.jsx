import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './Cameras.module.css';
import DroneIcon from '../components/icons/DroneIcon';
import CameraIcon from '../components/icons/CameraIcon';
import TickIcon from '../components/icons/TickIcon';
import ConnectIcon from '../components/icons/ConnectIcon';
import PlusIcon from '../components/icons/PlusIcon';
import { truncateText, formatDate } from '../utils/helpers';

export default function Cameras({ isPWA = false }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddingDevice, setIsAddingDevice] = useState(false);
  const [availableDevices, setAvailableDevices] = useState([]);
  const [devicesLoading, setDevicesLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        isAddingDevice
      ) {
        setIsAddingDevice(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAddingDevice]);

  // PLACEHOLDER DATA
  const placeholderData = [
    {
      id: 1,
      name: 'DJI Matrice 300 RTK',
      type: 'drone',
      isOnline: true,
      lastSyncedDate: null,
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
      lastSyncedDate: '2024-12-31T08:00:00',
      isConnected: false,
    },
    {
      id: 6,
      name: 'Skydio 2+',
      type: 'drone',
      isOnline: false,
      lastSyncedDate: '2024-12-31T08:00:00',
      isConnected: false,
    },
    {
      id: 7,
      name: 'Bosch FLEXIDOME IP starlight 8000i',
      type: 'camera',
      isOnline: false,
      lastSyncedDate: '2024-12-30T09:00:00',
      isConnected: false,
    },
    {
      id: 8,
      name: 'Hikvision DS-2CD2387G2-LU',
      type: 'camera',
      isOnline: false,
      lastSyncedDate: '2024-11-12T10:00:00',
      isConnected: false,
    },
    {
      id: 9,
      name: 'DJI Inspire 3',
      type: 'drone',
      isOnline: false,
      lastSyncedDate: '2024-09-22T22:22:22',
      isConnected: false,
    },
    {
      id: 10,
      name: 'Sony SNC-VM772R',
      type: 'camera',
      isOnline: false,
      lastSyncedDate: '2024-08-17T08:00:00',
      isConnected: false,
    },
  ];

  // Function to fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('${API_BASE_URL}/cameras');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData(placeholderData); // Fallback to placeholder data
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Function to fetch available devices
  const fetchAvailableDevices = async () => {
    setDevicesLoading(true);
    try {
      const response = await axios.get('${API_BASE_URL}/available-devices');
      setAvailableDevices(response.data);
    } catch (error) {
      console.error('Error fetching available devices:', error);
      setAvailableDevices([
        {
          id: 11,
          name: 'Pelco Spectra 7 PTZ',
          type: 'camera',
          isConnecting: false,
        },
        {
          id: 12,
          name: 'Yuneec H520E',
          type: 'drone',
          isConnecting: false,
        },
        {
          id: 13,
          name: 'Freefly Alta X',
          type: 'drone',
          isConnecting: true,
        },
        {
          id: 14,
          name: 'Hikvision DS-2CD2387G2-LU',
          type: 'camera',
          isConnecting: true,
        },
      ]); // Fallback to placeholder data
    } finally {
      setDevicesLoading(false);
    }
  };

  // Function to handle connecting a camera
  const handleConnectCamera = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/connect-camera/${id}`);
      setData((prevData) =>
        prevData.map((device) =>
          device.id === id ? { ...device, isConnected: true } : device
        )
      );
    } catch (error) {
      console.error('Error connecting camera:', error);
    }
  };

  // Function to handle pairing an available device
  const handlePairDevice = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/pair-device/${id}`);
      const pairedDevice = availableDevices.find((device) => device.id === id);
      setData((prevData) => [
        ...prevData,
        { ...pairedDevice, isConnected: true },
      ]);
      setAvailableDevices((prevDevices) =>
        prevDevices.filter((device) => device.id !== id)
      );
    } catch (error) {
      console.error('Error pairing device:', error);
    }
  };

  // Function to open dropdown - THERE IS NO API STUFF IN THIS DW
  const handleAddDevice = () => {
    if (isAddingDevice) {
      setIsAddingDevice(false);
    } else {
      setIsAddingDevice(true);
      fetchAvailableDevices();
    }
  };

  // Function to handle deleting a device
  const handleDeleteDevice = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/delete-camera/${id}`);
      setData((prevData) => prevData.filter((device) => device.id !== id));
    } catch (error) {
      console.error('Error deleting camera:', error);
    }
  };

  return (
    <div className={`${styles.cameras} ${isPWA ? styles.mobile : ''}`}>
      <h1>Cameras</h1>
      <div className={styles.heading}>
        <h2>Paired Devices</h2>
        <div className={styles.addDeviceContainer} ref={dropdownRef}>
          <button
            className={`${styles.addDeviceButton} ${isAddingDevice ? styles.active : ''}`}
            onClick={handleAddDevice}
          >
            <PlusIcon />
            Add Device
          </button>
          {isAddingDevice && (
            <div className={styles.dropdown}>
              <h3>Available Devices</h3>
              {devicesLoading ? (
                <p>Loading available devices...</p>
              ) : (
                availableDevices.map((device) => (
                  <div
                    key={device.id}
                    className={styles.dropdownItem}
                    onClick={() => handlePairDevice(device.id)}
                  >
                    <div className={styles.deviceName}>
                      {truncateText(device.name, 23)}
                    </div>
                    <div className={styles.deviceType}>{device.type}</div>
                    <div className={styles.deviceStatus}>
                      {device.isConnecting ? (
                        'Connecting...'
                      ) : (
                        <span>
                          <TickIcon />
                          Ready to pair
                        </span>
                      )}
                    </div>
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
        ) : data.length > 0 ? (
          data.map((camera) => (
            <div key={camera.id} className={styles.row}>
              <div className={styles.icon}>
                {camera.type === 'drone' ? <DroneIcon /> : <CameraIcon />}
              </div>
              <div className={styles.name}>
                {camera.name}
                {isPWA &&
                  !camera.isConnected &&
                  (camera.lastSyncedDate ? (
                    <div className={styles.lastSynced}>
                      {'Last Synced: ' +
                        formatDate(camera.lastSyncedDate, 'long')}
                    </div>
                  ) : (
                    <div className={styles.lastSynced}>Not synced</div>
                  ))}
              </div>
              <div className={styles.status}>
                <span
                  className={
                    camera.isOnline ? styles.onlineDot : styles.offlineDot
                  }
                />
                <span className={styles.statusText}>
                  {!isPWA && (camera.isOnline ? 'Online' : 'Offline')}
                </span>
              </div>
              {!isPWA && (
                <div className={styles.lastSynced}>
                  {camera.isConnected
                    ? ''
                    : camera.lastSyncedDate
                      ? 'Last Synced: ' +
                        formatDate(camera.lastSyncedDate, 'long')
                      : 'Not synced'}
                </div>
              )}
              <div className={styles.connectButtonContainer}>
                {camera.isConnected ? (
                  <span className={styles.connected} disabled={true}>
                    <TickIcon />
                    {!isPWA && 'Connected'}
                  </span>
                ) : (
                  <button
                    className={styles.connectButton}
                    disabled={camera.isOnline ? false : true}
                    onClick={() => handleConnectCamera(camera.id)}
                  >
                    <ConnectIcon />
                    {!isPWA && 'Connect'}
                  </button>
                )}
              </div>
              <div className={styles.delete}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteDevice(camera.id);
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
        ) : (
          <p>No cameras found.</p>
        )}
      </div>{' '}
    </div>
  );
}
