import styles from './Header.module.css';
import React from 'react';
import { useMode } from '../../context/ModeContext';
import Button from '../Button';
import ProfilePic from '../../assets/profile.png';

export default function Header({ showRightPane = false }) {
  const { mode } = useMode(); // Access mode from context

  return (
    <div className={styles.header}>
      <div className={styles.modes}>
        <span>{mode ? mode : 'Loading...'} mode</span>
        <Button size='small' color='primary' fill={false} text='Change Mode' />
      </div>
      <div className={`${styles.user} ${showRightPane && styles.paneOpen} `}>
        Hi, User
        <img src={ProfilePic} alt='profile picture' />
      </div>
    </div>
  );
}
