import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, NavLink, useNavigate } from 'react-router-dom'; // Import useNavigate
// import SlidingPane from 'react-sliding-pane';
// import 'react-sliding-pane/dist/react-sliding-pane.css';
import NavPane from './NavPane';
// import Header from './Header';
// import CalendarInfoPane from './infoPanes/CalendarInfoPane';
// import SessionsInfoPane from './infoPanes/SessionsInfoPane';
// import IncidentsInfoPane from './infoPanes/IncidentsInfoPane';
// import ConstructionSitesInfoPane from './infoPanes/ConstructionSitesInfoPane';
import styles from './PWALayout.module.css';
// import CrossIcon from '../icons/CrossIcon';
import HamburgerIcon from '../icons/HamburgerIcon';
import HomeIcon from '../icons/HomeIcon';
import ProfileIcon from '../icons/ProfileIcon';
import ArrowIcon from '../icons/ArrowIcon'; // Assuming you have a BackIcon component

const PWALayout = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Hook for navigation
  // const [isPaneOpen, setIsPaneOpen] = useState(false);
  // const [paneData, setPaneData] = useState(null);
  const [isNavPaneOpen, setIsNavPaneOpen] = useState(false);

  const toggleNavPane = () => {
    setIsNavPaneOpen(!isNavPaneOpen); // Toggle NavPane visibility
  };

  // Handle back button click
  const handleBack = () => {
    navigate(-1); // Go back in history
  };

  useEffect(() => {
    document.body.style.backgroundColor = 'var(--background-color)';
    return () => {
      document.body.style.backgroundColor = 'var(--light)';
    };
  });

  return (
    <div className={styles.pwaLayout}>
      {/* NavPane Overlay */}
      <div
        className={`${styles.navPaneOverlay} ${isNavPaneOpen && styles.active}`}
      >
        <NavPane
          isPWA={true}
          toggle={toggleNavPane}
          className={isNavPaneOpen ? styles.open : ''}
        />
      </div>

      {/* Main Content */}
      <div className={styles.main}>
        {/* Back Button */}
        {/* <div className={styles.backButtonContainer}> */}
        <div className={styles.backButton} onClick={handleBack}>
          <ArrowIcon size='25px' />
        </div>
        {/* </div> */}

        <main className={styles.content}>
          <Outlet
            context={
              {
                // setPaneData,
                // setIsPaneOpen,
                // isPaneOpen,
              }
            }
          />
        </main>

        <footer
          className={`${styles.footer} ${isNavPaneOpen && styles.navPaneOpen}`}
        >
          {/* Hamburger Icon */}
          <span
            className={`${styles.footerItem} ${
              isNavPaneOpen ? styles.active : ''
            }`}
            onClick={toggleNavPane}
          >
            <HamburgerIcon size='25px' />
          </span>

          {/* Home Icon */}
          <NavLink
            to='/dashboard'
            className={`${styles.footerItem} ${
              location.pathname === '/dashboard' && !isNavPaneOpen
                ? styles.active
                : ''
            }`}
            onClick={() => setIsNavPaneOpen(false)}
          >
            <HomeIcon />
          </NavLink>

          {/* Profile Icon */}
          <NavLink
            to='/settings'
            className={`${styles.footerItem} ${
              location.pathname === '/settings' && !isNavPaneOpen
                ? styles.active
                : ''
            }`}
            onClick={() => setIsNavPaneOpen(false)}
          >
            <ProfileIcon />
          </NavLink>
        </footer>
      </div>

      {/* Right Sliding Pane */}
      {/* {showRightPane && (
        <SlidingPane
          className={styles.slidingPane}
          overlayClassName={styles.paneOverlay}
          isOpen={isPaneOpen}
          hideHeader={true}
          width="26vw"
          padding="66px 51px"
          onRequestClose={() => {
            setIsPaneOpen(false);
            setPaneData(null);
          }}
        >
          {location.pathname !== '/timeline/calendar' && (
            <span
              className={styles.closeButton}
              onClick={() => {
                setIsPaneOpen(false);
                setPaneData(null);
              }}
            >
              <CrossIcon size="25px" />
            </span>
          )}
          {getRightPaneContent()}
        </SlidingPane>
      )} */}
    </div>
  );
};

export default PWALayout;
