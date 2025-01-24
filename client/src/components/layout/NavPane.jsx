import { useEffect, useState } from "react";
import styles from "./NavPane.module.css";
import Logo from "../icons/Logo";
import { NavLink } from "react-router-dom";
import NPDashboardIcon from "../icons/NPDashboardIcon";
import NPSafetyTrendsIcon from "../icons/NPSafetyTrendsIcon";
import NPTimelineIcon from "../icons/NPTimelineIcon";
import NPAlertHistoryIcon from "../icons/NPAlertHistoryIcon";
import NPConstructionSitesIcon from "../icons/NPConstructionSitesIcon";
import NPCamerasIcon from "../icons/NPCamerasIcon";
import ArrowIcon from "../icons/ArrowIcon";

export default function NavPane() {
  const [toggleDropdown, setToggleDropdown] = useState({
    "safety-trends": true,
    timeline: true,
  });

  const handleToggle = (key) => {
    setToggleDropdown((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  useEffect(() => {
    console.log(toggleDropdown);
  }, [toggleDropdown]);

  return (
    <nav className={styles.navpane}>
      <Logo size={40} />
      <div className={styles.list}>
        <NavLink to="/dashboard">
          {({ isActive }) => (
            <div
              className={`${styles.navlink} ${isActive ? styles.active : ""}`}
            >
              <NPDashboardIcon />
              <p>Dashboard</p>
              <ArrowIcon />
            </div>
          )}
        </NavLink>

        <NavLink to="/safety-trends">
          {({ isActive }) => (
            <>
              <div
                className={`${styles.navlink} ${isActive ? styles.active : ""}`}
                onClick={() => handleToggle("safety-trends")} // Pass the key for this dropdown
              >
                <NPSafetyTrendsIcon />
                <p>Safety Trends</p>
                <ArrowIcon
                  className={`${styles.arrowIcon} ${isActive && toggleDropdown["safety-trends"] ? styles.rotate : ""}`}
                />
              </div>

              {/* Dropdown Menu */}
              {isActive && toggleDropdown["safety-trends"] && (
                <ul className={styles.dropdown}>
                  <NavLink
                    to={"/safety-trends/overall"}
                    className={({ isActive }) =>
                      `${styles.subNavlink} ${isActive ? styles.active : ""}`
                    }
                  >
                    <li>Overall Safety</li>
                  </NavLink>
                  <li className={styles.sectionHeader}>PPE Detection</li>
                  <NavLink
                    to={"/safety-trends/helmet"}
                    className={({ isActive }) =>
                      `${styles.subNavlink} ${isActive ? styles.active : ""}`
                    }
                  >
                    <li>Helmet</li>
                  </NavLink>
                  <NavLink
                    to={"/safety-trends/footwear"}
                    className={({ isActive }) =>
                      `${styles.subNavlink} ${isActive ? styles.active : ""}`
                    }
                  >
                    <li>Footwear</li>
                  </NavLink>
                  <NavLink
                    to={"/safety-trends/vest"}
                    className={({ isActive }) =>
                      `${styles.subNavlink} ${isActive ? styles.active : ""}`
                    }
                  >
                    <li>Vest</li>
                  </NavLink>
                  <NavLink
                    to={"/safety-trends/gloves"}
                    className={({ isActive }) =>
                      `${styles.subNavlink} ${isActive ? styles.active : ""}`
                    }
                  >
                    <li>Gloves</li>
                  </NavLink>
                  <NavLink
                    to={"/safety-trends/scaffolding"}
                    className={({ isActive }) =>
                      `${styles.subNavlink} ${isActive ? styles.active : ""}`
                    }
                  >
                    <li>Scaffolding</li>
                  </NavLink>
                  <li className={styles.sectionHeader}>Fall Protection</li>
                  <NavLink
                    to={"/safety-trends/guardrails"}
                    className={({ isActive }) =>
                      `${styles.subNavlink} ${isActive ? styles.active : ""}`
                    }
                  >
                    <li>Guardrails</li>
                  </NavLink>
                  <NavLink
                    to={"/safety-trends/harness"}
                    className={({ isActive }) =>
                      `${styles.subNavlink} ${isActive ? styles.active : ""}`
                    }
                  >
                    <li>Harness</li>
                  </NavLink>
                </ul>
              )}
            </>
          )}
        </NavLink>

        <NavLink to="/timeline">
          {({ isActive }) => (
            <>
              <div
                className={`${styles.navlink} ${isActive ? styles.active : ""}`}
                onClick={() => handleToggle("timeline")} // Pass the key for this dropdown
              >
                <NPTimelineIcon />
                <p>Timeline</p>
                <ArrowIcon
                  className={`${styles.arrowIcon} ${isActive && toggleDropdown["timeline"] ? styles.rotate : ""}`}
                />
              </div>
              {/* Dropdown Menu */}
              {isActive && toggleDropdown["timeline"] && (
                <ul className={styles.dropdown}>
                  <NavLink
                    to={"/timeline/calendar"}
                    className={({ isActive }) =>
                      `${styles.subNavlink} ${isActive ? styles.active : ""}`
                    }
                  >
                    <li>Calendar</li>
                  </NavLink>
                  <NavLink
                    to={"/timeline/sessions"}
                    className={({ isActive }) =>
                      `${styles.subNavlink} ${isActive ? styles.active : ""}`
                    }
                  >
                    <li>Sessions</li>
                  </NavLink>
                </ul>
              )}
            </>
          )}
        </NavLink>

        <NavLink to="/alert-history">
          {({ isActive }) => (
            <div
              className={`${styles.navlink} ${isActive ? styles.active : ""}`}
            >
              <NPAlertHistoryIcon />
              <p>Alert History</p>
              <ArrowIcon />
            </div>
          )}
        </NavLink>

        <NavLink to="/construction-sites">
          {({ isActive }) => (
            <div
              className={`${styles.navlink} ${isActive ? styles.active : ""}`}
            >
              <NPConstructionSitesIcon />
              <p>Construction Sites</p>
              <ArrowIcon />
            </div>
          )}
        </NavLink>

        <NavLink to="/cameras">
          {({ isActive }) => (
            <div
              className={`${styles.navlink} ${isActive ? styles.active : ""}`}
            >
              <NPCamerasIcon />
              <p>Cameras</p>
              <ArrowIcon />
            </div>
          )}
        </NavLink>
      </div>
    </nav>
  );
}
