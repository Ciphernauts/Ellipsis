import { useState, useEffect, useRef } from 'react';
import EditIcon from '../components/icons/EditIcon';
import CrossIcon from '../components/icons/CrossIcon';
import UserDefaultImage from '../assets/UserDefaultImage.png';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';
import styles from './Settings.module.css';
import { useNavigate } from 'react-router-dom';

const TABS = ['profile', 'notifications', 'system'];

const Settings = ({ isPWA = false }) => {
  const {
    user,
    isAdmin,
    logout,
    fetchProfile,
    updateUserInfo,
    deleteUserAccount,
    settings,
    fetchSettings,
    updateSettings,
  } = useApp();

  const usernameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [editableFields, setEditableFields] = useState({
    username: false,
    email: false,
    password: false,
  });

  const [updatedProfile, setUpdatedProfile] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
    profilePicture: user?.profilePicture || UserDefaultImage,
  });

  const [updatedSystem, setUpdatedSystem] = useState({
    defaultMode: 'General',
    dataRefreshInterval: '5 minutes',
    dataTransferInterval: '5 minutes',
  });

  const [updatedNotifications, setUpdatedNotifications] = useState({
    pushNotifications: true,
    emailAlerts: true,
    highPriorityAlerts: false,
  });

  const [errorMessage, setErrorMessage] = useState('');

  const getTabFromHash = () => {
    const hash = window.location.hash.replace('#', '');
    return TABS.includes(hash) ? hash : 'profile';
  };

  const [activeTab, setActiveTab] = useState(getTabFromHash);

  useEffect(() => {
    const handleHashChange = () => setActiveTab(getTabFromHash());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const changeTab = (tab) => {
    window.location.hash = tab;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await fetchProfile();
        await fetchSettings();
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setErrorMessage('Failed to fetch data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      setUpdatedProfile({
        username: user.username,
        email: user.uemail,
        password: '',
        confirmPassword: '',
        profilePicture: user.profilePicture || UserDefaultImage,
      });
    }
  }, [user]);

  useEffect(() => {
    if (settings) {
      setUpdatedSystem({
        defaultMode: settings.defaultMode,
        dataRefreshInterval: settings.dataRefreshInterval,
        dataTransferInterval: settings.dataTransferInterval,
      });

      setUpdatedNotifications({
        pushNotifications: settings.pushNotifications,
        emailAlerts: settings.emailAlerts,
        highPriorityAlerts: settings.highPriorityAlerts,
      });
    }
  }, [settings]);

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (confirmDelete) {
      try {
        await deleteUserAccount();
      } catch (error) {
        console.error('Failed to delete account:', error);
        setErrorMessage('Failed to delete account. Please try again later.');
      }
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    
    if (confirmLogout) {
      logout(); // Clear user state and token
      navigate('/login'); // Redirect to login page
    }
  };

  const handleSave = async () => {
    const activeTab = getTabFromHash();
    setErrorMessage(''); // Clear any previous error messages

    try {
        if (activeTab === 'profile') {
            if (updatedProfile.password !== updatedProfile.confirmPassword) {
                setErrorMessage('Passwords do not match.');
                return;
            }

            if (updatedProfile.email && !updatedProfile.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                setErrorMessage('Please enter a valid email address.');
                return;
            }

            if (
                updatedProfile.password &&
                !updatedProfile.password.match(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
                )
            ) {
                setErrorMessage(
                    'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
                );
                return;
            }

            const hasProfileChanged = Object.keys(updatedProfile).some(
                (key) =>
                    updatedProfile[key] !== user[key] &&
                    key !== 'confirmPassword'
            );

            if (!hasProfileChanged) {
                setErrorMessage('No changes have been made to your profile.');
                return;
            }

            const updatedProfileData = {
                username: editableFields.username ? updatedProfile.username : undefined,
                email: editableFields.email ? updatedProfile.email : undefined,
                password: editableFields.password ? updatedProfile.password : undefined,
                profilePicture: updatedProfile.profilePicture,
            };

            const response = await updateUserInfo(updatedProfileData);

            if (response?.success) {
                alert(response.message || 'Settings saved successfully!');
                await fetchProfile();
                await fetchSettings();
                setEditableFields({ username: false, email: false, password: false });
            } else {
                setErrorMessage(response?.message || 'Failed to update profile.');
            }
        } else if (activeTab === 'system') {
            const hasSystemChanged = Object.keys(updatedSystem).some(
                (key) => updatedSystem[key] !== settings[key]
            );

            if (!hasSystemChanged) {
                setErrorMessage('No changes have been made to system settings.');
                return;
            }

            const response = await updateSettings(updatedSystem);

            if (response?.success) {
                alert(response.message || 'Settings saved successfully!');
                await fetchProfile();
                await fetchSettings();
            } else {
                setErrorMessage(response?.message || 'Failed to update system settings.');
            }
        } else if (activeTab === 'notifications') {
            const hasNotificationsChanged = Object.keys(updatedNotifications).some(
                (key) => updatedNotifications[key] !== settings[key]
            );

            if (!hasNotificationsChanged) {
                setErrorMessage('No changes have been made to notification settings.');
                return;
            }

            const response = await updateSettings(updatedNotifications);

            if (response?.success) {
                alert(response.message || 'Settings saved successfully!');
                await fetchProfile();
                await fetchSettings();
            } else {
                setErrorMessage(response?.message || 'Failed to update notification settings.');
            }
        }
    } catch (error) {
        console.error('Error saving settings:', error);
        setErrorMessage('An error occurred while saving settings. Please try again.');
    }
};

  const handleCancel = () => {
    setEditableFields({ username: false, email: false, password: false });
    setUpdatedProfile({
      username: user?.username || '',
      email: user?.email || '',
      password: '',
      confirmPassword: '',
      profilePicture: user?.profilePicture || UserDefaultImage,
    });
    setUpdatedSystem({
      defaultMode: settings.defaultMode,
      dataRefreshInterval: settings.dataRefreshInterval,
      dataTransferInterval: settings.dataTransferInterval,
    });
    setUpdatedNotifications({
      pushNotifications: settings.pushNotifications,
      emailAlerts: settings.emailAlerts,
      highPriorityAlerts: settings.highPriorityAlerts,
    });
    setErrorMessage('');
  };

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUpdatedProfile({
          ...updatedProfile,
          profilePicture: event.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleEditableField = (field) => {
    setEditableFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const renderInputField = (
    label,
    field,
    type = 'text',
    ref,
    isPassword = false
  ) => (
    <div className={styles.inputField}>
      <label htmlFor={field}>{label}</label>
      <div
        className={`${styles.inputContainer} ${!editableFields[field] && styles.disabled}`}
      >
        {isPassword && !editableFields[field] ? (
          <input type='password' value='••••••••' readOnly />
        ) : (
          <>
            <input
              type={type}
              value={updatedProfile[field]}
              name={field}
              readOnly={!editableFields[field]}
              ref={ref}
              placeholder={isPassword ? 'New Password' : ''}
              onChange={(e) => {
                setUpdatedProfile({
                  ...updatedProfile,
                  [field]: e.target.value,
                });
              }}
            />
            {isPassword && (
              <input
                type='password'
                placeholder='Confirm Password'
                value={updatedProfile.confirmPassword}
                onChange={(e) =>
                  setUpdatedProfile({
                    ...updatedProfile,
                    confirmPassword: e.target.value,
                  })
                }
              />
            )}
          </>
        )}
        <span
          className={styles.editIcon}
          onClick={() => toggleEditableField(field)}
        >
          {editableFields[field] ? <CrossIcon /> : <EditIcon />}
        </span>
      </div>
    </div>
  );

  const renderToggleField = (label, field, state, setState) => {
    const handleToggle = () => {
      setState((prevState) => ({ ...prevState, [field]: !prevState[field] }));
    };

    return (
      <div
        className={styles.toggleField}
        onClick={handleToggle}
        role='button'
        tabIndex={0}
        aria-label={label}
      >
        <span>{label}</span>
        <label className={styles.toggleSwitch}>
          <input
            type='checkbox'
            checked={state[field]}
            onChange={handleToggle}
            aria-label={label}
          />
          <span className={styles.slider}></span>
        </label>
      </div>
    );
  };

  const renderDropdownField = (
    label,
    field,
    options,
    state,
    setState,
    description,
    isDisabled
  ) => (
    <div className={styles.dropdownField}>
      <label>{label}</label>
      <select
        value={state[field]}
        onChange={(e) => setState({ ...state, [field]: e.target.value })}
        disabled={isDisabled}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <p>{description}</p>
    </div>
  );

  return (
    <div className={`${styles.settingsPage} ${isPWA ? styles.mobile : ''}`}>
      <h1>Settings</h1>
      <div className={styles.settingsContainer}>
        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? styles.active : ''}
              onClick={() => changeTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Settings
            </button>
          ))}
        </div>
        <div className={styles.tabContent}>
          {isLoading ? (
            <div>Loading settings...</div>
          ) : (
            <>
              {activeTab === 'profile' && (
                <div className={styles.profileSettings}>
                  <div className={styles.profileDetails}>
                    {renderInputField(
                      'Username',
                      'username',
                      'text',
                      usernameInputRef
                    )}
                    {renderInputField('Email', 'email', 'email', emailInputRef)}
                    {renderInputField(
                      'Password',
                      'password',
                      'password',
                      passwordInputRef,
                      true
                    )}
                    {errorMessage && (
                      <p className={styles.errorMessage}>{errorMessage}</p>
                    )}
                    <div className={styles.deleteAccount}>
                      <p
                        className={styles.deleteLine}
                        onClick={handleDeleteAccount}
                      >
                        <span>Delete</span> Your Account
                      </p>
                      <p>
                        Please note that all your account data will be deleted.
                      </p>
                    </div>
                  </div>
                  <div className={styles.pfpDetails}>
                    <div className={styles.profilePicture}>
                      <img src={updatedProfile.profilePicture} alt='Profile' />
                      <label className={styles.editPictureButton}>
                        <EditIcon color='var(--light)' size='15px' />
                        <input
                          type='file'
                          accept='image/*'
                          style={{ display: 'none' }}
                          onChange={handleProfilePictureUpload}
                        />
                      </label>
                    </div>
                    <Button
                      text='Log Out'
                      size='small'
                      onClick={handleLogout}
                    />
                  </div>
                </div>
              )}
              {activeTab === 'system' && (
                <div
                  className={`${styles.systemPreferences} ${!isAdmin ? styles.standardUserPreferences : ''}`}
                >
                  {!isAdmin && 'Only the admin can update system settings.'}
                  {renderDropdownField(
                    'System Mode',
                    'defaultMode',
                    ['General', 'Entry', 'Height', 'Workshop'],
                    updatedSystem,
                    setUpdatedSystem,
                    "Set the system's default operational mode on startup.",
                    !isAdmin
                  )}
                  <div className={styles.dropdownRow}>
                    {renderDropdownField(
                      'Data Refresh Interval',
                      'dataRefreshInterval',
                      ['1 minute', '3 minutes', '5 minutes', '10 minutes'],
                      updatedSystem,
                      setUpdatedSystem,
                      'Adjust how frequently the dashboard updates its data.',
                      !isAdmin
                    )}
                    {renderDropdownField(
                      'Data Transfer Interval',
                      'dataTransferInterval',
                      ['1 minute', '3 minutes', '5 minutes', '10 minutes'],
                      updatedSystem,
                      setUpdatedSystem,
                      'Adjust how frequently the data syncs between devices.',
                      !isAdmin
                    )}
                  </div>
                  {errorMessage && (
                    <p className={styles.errorMessage}>{errorMessage}</p>
                  )}
                </div>
              )}
              {activeTab === 'notifications' && (
                <div className={styles.notifications}>
                  {renderToggleField(
                    'Push Notifications',
                    'pushNotifications',
                    updatedNotifications,
                    setUpdatedNotifications
                  )}
                  {/* {renderToggleField(
                    'Email Alerts',
                    'emailAlerts',
                    updatedNotifications,
                    setUpdatedNotifications
                  )}
                  {renderToggleField(
                    'Only High Priority Alerts',
                    'highPriorityAlerts',
                    updatedNotifications,
                    setUpdatedNotifications
                  )} */}
                  {errorMessage && (
                    <p className={styles.errorMessage}>{errorMessage}</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        <div className={styles.buttons}>
          <Button
            text='Cancel'
            color='primary'
            fill={false}
            onClick={handleCancel}
            className={styles.button}
          />
          <Button
            text='Save'
            color='primary'
            onClick={handleSave}
            className={styles.button}
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;
