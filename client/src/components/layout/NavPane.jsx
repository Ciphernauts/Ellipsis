import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './NavPane.module.css';
import img from '../../assets/Icon_black_png.png';
import NPDashboardIcon from '../icons/NPDashboardIcon';
import NPSafetyTrendsIcon from '../icons/NPSafetyTrendsIcon';
import NPTimelineIcon from '../icons/NPTimelineIcon';
import NPIncidentsIcon from '../icons/NPIncidentsIcon';
import NPConstructionSitesIcon from '../icons/NPConstructionSitesIcon';
import NPCamerasIcon from '../icons/NPCamerasIcon';
import NPSettingsIcon from '../icons/NPSettingsIcon';
import NPLogOutIcon from '../icons/NPLogOutIcon';
import ArrowIcon from '../icons/ArrowIcon';

export default function NavPane() {
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

  return (
    <nav className={styles.navpane}>
      <a href='/'>
        <img src={img} alt='' />
      </a>
      <div className={styles.list}>
        <NavLink to='/dashboard'>
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
            >
              <li>Overall Safety</li>
            </NavLink>
            <li className={styles.sectionHeader}>PPE Detection</li>
            <NavLink
              to='/safety-trends/helmet'
              className={({ isActive }) =>
                `${styles.subNavlink} ${isActive ? styles.active : ''}`
              }
            >
              <li>Helmet</li>
            </NavLink>
            <NavLink
              to='/safety-trends/footwear'
              className={({ isActive }) =>
                `${styles.subNavlink} ${isActive ? styles.active : ''}`
              }
            >
              <li>Footwear</li>
            </NavLink>
            <NavLink
              to='/safety-trends/vest'
              className={({ isActive }) =>
                `${styles.subNavlink} ${isActive ? styles.active : ''}`
              }
            >
              <li>Vest</li>
            </NavLink>
            <NavLink
              to='/safety-trends/gloves'
              className={({ isActive }) =>
                `${styles.subNavlink} ${isActive ? styles.active : ''}`
              }
            >
              <li>Gloves</li>
            </NavLink>
            <NavLink
              to='/safety-trends/scaffolding'
              className={({ isActive }) =>
                `${styles.subNavlink} ${isActive ? styles.active : ''}`
              }
            >
              <li>Scaffolding</li>
            </NavLink>
            <li className={styles.sectionHeader}>Fall Protection</li>
            <NavLink
              to='/safety-trends/guardrails'
              className={({ isActive }) =>
                `${styles.subNavlink} ${isActive ? styles.active : ''}`
              }
            >
              <li>Guardrails</li>
            </NavLink>
            <NavLink
              to='/safety-trends/harness'
              className={({ isActive }) =>
                `${styles.subNavlink} ${isActive ? styles.active : ''}`
              }
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
            >
              <li>Calendar</li>
            </NavLink>
            <NavLink
              to='/timeline/sessions'
              className={({ isActive }) =>
                `${styles.subNavlink} ${isActive ? styles.active : ''}`
              }
            >
              <li>Sessions</li>
            </NavLink>
          </ul>
        )}

        {/* Timeline (Dropdown) */}
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
            >
              <li>Incident Trends</li>
            </NavLink>
            <NavLink
              to='/incidents/incident-history'
              className={({ isActive }) =>
                `${styles.subNavlink} ${isActive ? styles.active : ''}`
              }
            >
              <li>Incident History</li>
            </NavLink>
          </ul>
        )}

        <NavLink to='/construction-sites'>
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

        <NavLink to='/cameras'>
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

        <div className={styles.bottomLinks}>
          <NavLink to='/settings'>
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
          <NavLink to='/logout'>
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
