import React from 'react';
import styles from './ChangeMode.module.css';
import GeneralModeIcon from '../components/icons/GeneralModeIcon';
import EntryModeIcon from '../components/icons/EntryModeIcon';
import HeightModeIcon from '../components/icons/HeightModeIcon';
import WorkshopModeIcon from '../components/icons/WorkshopModeIcon';
import Button from '../components/Button';
import ArrowIcon from '../components/icons/ArrowIcon';
import { useMode } from '../context/ModeContext'; // Adjust the path if needed

export default function ChangeMode() {
  const { mode: activeMode, isLoading, updateMode } = useMode();

  const modes = [
    {
      id: 1,
      name: 'General',
      icon: <GeneralModeIcon />,
      description: 'Overall site monitoring during normal operations.',
    },
    {
      id: 2,
      name: 'Entry',
      icon: <EntryModeIcon />,
      description: 'Monitoring during site entry.',
    },
    {
      id: 3,
      name: 'Height',
      icon: <HeightModeIcon />,
      description: 'Monitoring workers at heights.',
    },
    {
      id: 4,
      name: 'Workshop',
      icon: <WorkshopModeIcon />,
      description: 'Monitoring in workshop areas.',
    },
  ];

  if (isLoading) {
    return <div>Loading modes...</div>;
  }

  return (
    <div className={styles.changeMode}>
      <h1>Change Mode</h1>
      <div className={styles.modesContainer}>
        {modes.map((mode) => (
          <div
            key={mode.id}
            className={`${styles.mode} ${'dashboardCard'} ${mode.name === activeMode ? styles.active : ''}`}
          >
            <div className={styles.icon}>{mode.icon}</div>
            <h2>{mode.name}</h2>
            <p>{mode.description}</p>
            {mode.name !== activeMode && (
              <Button
                text='Activate'
                size='small'
                onClick={() => updateMode(mode.name)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
