import styles from './Header.module.css';
import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../Button';
import ProfilePic from '../../assets/UserDefaultImage.png';
import { useNavigate } from 'react-router-dom'; // Step 1: Import useNavigate

export default function Header({ showRightPane = false, className }) {
  const { mode, user, fetchMode, fetchProfile, isLoading } = useApp();
  const navigate = useNavigate(); // Step 2: Initialize navigate

  // Fetch mode and user profile when the component mounts
  useEffect(() => {
    fetchMode();
    fetchProfile();
  }, []);

  console.log('header user: ', user);

  return (
    <div className={`${styles.header} ${className}`}>
      <div className={styles.modes}>
        <span>{isLoading || !mode ? 'Loading mode...' : `${mode} mode`}</span>
        <Button
          size='small'
          color='primary'
          fill={false}
          text='Change Mode'
          to={'/change-mode'}
        />
      </div>
      {!showRightPane && (
        <div
          className={`${styles.user} ${showRightPane && styles.paneOpen}`}
          onClick={() => navigate('/settings#profile')}
        >
          Hi, {isLoading || !user?.username ? 'User' : user.username}
          <img
            src={
              isLoading || !user?.profilePicture
                ? ProfilePic
                : user.profilePicture
            }
            alt='profile picture'
          />
        </div>
      )}
    </div>
  );
}
