import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './NavPane.module.css';
import img from '../../assets/Icon_black_png.png';
import { useApp } from '../../context/AppContext';
import NPDashboardIcon from '../icons/NPDashboardIcon';
import NPSafetyTrendsIcon from '../icons/NPSafetyTrendsIcon';
import NPTimelineIcon from '../icons/NPTimelineIcon';
import NPIncidentsIcon from '../icons/NPIncidentsIcon';
import NPConstructionSitesIcon from '../icons/NPConstructionSitesIcon';
import NPCamerasIcon from '../icons/NPCamerasIcon';
import NPSettingsIcon from '../icons/NPSettingsIcon';
import NPLogOutIcon from '../icons/NPLogOutIcon';
import ArrowIcon from '../icons/ArrowIcon';
import CrossIcon from '../icons/CrossIcon';
import Button from '../Button';

// PWA-specific component
function PWATopSection({ toggle }) {
  const { mode, fetchMode } = useApp();

  useEffect(() => {
    fetchMode();
  }, [fetchMode]);

  return (
    <div className={styles.navpaneHeader}>
      <img src={img} alt='Logo' />
      <div className={styles.desc}>
        <h2>Ellipsis</h2>
        <p>{!mode ? 'Loading mode...' : `${mode} mode`}</p>
      </div>
      <span
        className={styles.closeButton}
        onClick={() => {
          toggle(false);
        }}
      >
        <CrossIcon size='26px' />
      </span>
    </div>
  );
}

export default function NavPane({ isPWA = false, toggle, className }) {
  const location = useLocation();
  const [toggleDropdown, setToggleDropdown] = useState({
    'safety-trends': false,
    'timeline': false,
  });

  const handleToggle = (key) => {
    setToggleDropdown((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  // Check if any of the dropdown sub-items are active
  const isSafetyTrendsActive = location.pathname.startsWith('/safety-trends');
  const isTimelineActive = location.pathname.startsWith('/timeline');
  const isIncidentsActive = location.pathname.startsWith('/incidents');

  // Function to handle link clicks and close the pane
  const handleLinkClick = () => {
    if (isPWA) {
      toggle(false);
    }
  };

  return (
    <nav className={`${styles.navpane} ${isPWA && styles.mobile} ${className}`}>
      {isPWA ? (
        <PWATopSection toggle={toggle} />
      ) : (
        <a href='/'>
          <img src={img} alt='Logo' />
        </a>
      )}
      <div className={styles.list}>
        <NavLink to='/dashboard' onClick={handleLinkClick}>
          {({ isActive }) => (
            <div
              className={`${styles.navlink} ${isActive ? styles.active : ''}`}
            >
              <NPDashboardIcon />
              <p>Dashboard</p>
              <ArrowIcon />
            </div>
          )}
        </NavLink>

        {/* Safety Trends (Dropdown) */}
        <div
          className={`${styles.navlink} ${isSafetyTrendsActive ? styles.active : ''}`}
          onClick={() => handleToggle('safety-trends')}
        >
          <NPSafetyTrendsIcon />
          <p>Safety Trends</p>
          <ArrowIcon
            className={`${styles.arrowIcon} ${toggleDropdown['safety-trends'] ? styles.rotate : ''}`}
          />
        </div>

        {toggleDropdown['safety-trends'] && (
          <ul className={styles.dropdown}>
            <NavLink
              to='/safety-trends/overall'
              className={({ isActive }) =>
                `${styles.subNavlink} ${isActive ? styles.active : ''}`
              }
              onClick={handleLinkClick}
            >
              <li>Overall Safety</li>
            </NavLink>
            <li className={styles.sectionHeader}>PPE Detection</li>
            <NavLink
              to='/safety-trends/ppe/helmet'
              className={({ isActive }) =>
                `${styles.subNavlink} ${isActive ? styles.active : ''}`
              }
              onClick={handleLinkClick}
            >
              <li>Helmet</li>
            </NavLink>
            <NavLink
              to='/safety-trends/ppe/footwear'
              className={({ isActive }) =>
                `${styles.subNavlink} ${isActive ? styles.active : ''}`
              }
              onClick={handleLinkClick}
            >
              <li>Footwear</li>
            </NavLink>
            <NavLink
              to='/safety-trends/ppe/vest'
              className={({ isActive }) =>
                `${styles.subNavlink} ${isActive ? styles.active : ''}`
              }
              onClick={handleLinkClick}
            >
              <li>Vest</li>
            </NavLink>
            <NavLink
              to='/safety-trends/ppe/gloves'
              className={({ isActive }) =>
                `${styles.subNavlink} ${isActive ? styles.active : ''}`
              }
              onClick={handleLinkClick}
            >
              <li>Gloves</li>
            </NavLink>
            <li className={styles.sectionHeader}>Fall Protection</li>
            <NavLink
              to='/safety-trends/fall-protection/scaffolding'
              className={({ isActive }) =>
                `${styles.subNavlink} ${isActive ? styles.active : ''}`
              }
              onClick={handleLinkClick}
            >
              <li>Scaffolding</li>
            </NavLink>
            <NavLink
              to='/safety-trends/fall-protection/guardrails'
              className={({ isActive }) =>
                `${styles.subNavlink} ${isActive ? styles.active : ''}`
              }
              onClick={handleLinkClick}
            >
              <li>Guardrails</li>
            </NavLink>
            <NavLink
              to='/safety-trends/fall-protection/harness'
              className={({ isActive }) =>
                `${styles.subNavlink} ${isActive ? styles.active : ''}`
              }
              onClick={handleLinkClick}
            >
              <li>Harness</li>
            </NavLink>
          </ul>
        )}

        {/* Timeline (Dropdown) */}
        <div
          className={`${styles.navlink} ${isTimelineActive ? styles.active : ''}`}
          onClick={() => handleToggle('timeline')}
        >
          <NPTimelineIcon />
          <p>Timeline</p>
          <ArrowIcon
            className={`${styles.arrowIcon} ${toggleDropdown['timeline'] ? styles.rotate : ''}`}
          />
        </div>

        {toggleDropdown['timeline'] && (
          <ul className={styles.dropdown}>
            <NavLink
              to='/timeline/calendar'
              className={({ isActive }) =>
                `${styles.subNavlink} ${isActive ? styles.active : ''}`
              }
              onClick={handleLinkClick}
            >
              <li>Calendar</li>
            </NavLink>
            <NavLink
              to='/timeline/sessions'
              className={({ isActive }) =>
                `${styles.subNavlink} ${isActive ? styles.active : ''}`
              }
              onClick={handleLinkClick}
            >
              <li>Sessions</li>
            </NavLink>
          </ul>
        )}

        {/* Incidents (Dropdown) */}
        <div
          className={`${styles.navlink} ${isIncidentsActive ? styles.active : ''}`}
          onClick={() => handleToggle('incidents')}
        >
          <NPIncidentsIcon />
          <p>Incidents</p>
          <ArrowIcon
            className={`${styles.arrowIcon} ${toggleDropdown['incidents'] ? styles.rotate : ''}`}
          />
        </div>

        {toggleDropdown['incidents'] && (
          <ul className={styles.dropdown}>
            <NavLink
              to='/incidents/incident-trends'
              className={({ isActive }) =>
                `${styles.subNavlink} ${isActive ? styles.active : ''}`
              }
              onClick={handleLinkClick}
            >
              <li>Incident Trends</li>
            </NavLink>
            <NavLink
              to='/incidents/incident-history'
              className={({ isActive }) =>
                `${styles.subNavlink} ${isActive ? styles.active : ''}`
              }
              onClick={handleLinkClick}
            >
              <li>Incident History</li>
            </NavLink>
          </ul>
        )}

        <NavLink to='/construction-sites' onClick={handleLinkClick}>
          {({ isActive }) => (
            <div
              className={`${styles.navlink} ${isActive ? styles.active : ''}`}
            >
              <NPConstructionSitesIcon />
              <p>Construction Sites</p>
              <ArrowIcon />
            </div>
          )}
        </NavLink>

        <NavLink
          to='/cameras'
          onClick={handleLinkClick}
          className={styles.lastLink}
        >
          {({ isActive }) => (
            <div
              className={`${styles.navlink} ${isActive ? styles.active : ''}`}
            >
              <NPCamerasIcon />
              <p>Cameras</p>
              <ArrowIcon />
            </div>
          )}
        </NavLink>
        {isPWA && (
          <Button
            text='Change Mode'
            size='medium'
            className={styles.changeMode}
            to='/change-mode'
            onClick={handleLinkClick}
          />
        )}
        <div className={styles.bottomLinks}>
          <NavLink to='/settings' onClick={handleLinkClick}>
            {({ isActive }) => (
              <div
                className={`${styles.navlink} ${isActive ? styles.active : ''}`}
              >
                <NPSettingsIcon />
                <p>Settings</p>
                <ArrowIcon />
              </div>
            )}
          </NavLink>
          <NavLink
            to='/logout'
            onClick={handleLinkClick}
            className={styles.lastLink}
          >
            {({ isActive }) => (
              <div
                className={`${styles.navlink} ${isActive ? styles.active : ''}`}
              >
                <NPLogOutIcon />
                <p>Log Out</p>
                <ArrowIcon />
              </div>
            )}
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
