import styles from './Header.module.css';
import React from 'react';
import { useMode } from '../../context/ModeContext';
import Button from '../Button';
import ProfilePic from '../../assets/profile.png';

export default function Header({ showRightPane = false, className }) {
  const { mode } = useMode(); // Access mode from context

  return (
    <div className={`${styles.header} ${className}`}>
      <div className={styles.modes}>
        <span>{mode ? mode : 'Loading...'} mode</span>
        <Button
          size='small'
          color='primary'
          fill={false}
          text='Change Mode'
          to={'/change-mode'}
        />
      </div>
      {!showRightPane && (
        <div className={`${styles.user} ${showRightPane && styles.paneOpen} `}>
          Hi, User
          <img src={ProfilePic} alt='profile picture' />
        </div>
      )}
    </div>
  );
}
