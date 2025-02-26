import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, NavLink, useNavigate } from 'react-router-dom';
import NavPane from './NavPane';
import styles from './PWALayout.module.css';
import HamburgerIcon from '../icons/HamburgerIcon';
import HomeIcon from '../icons/HomeIcon';
import ProfileIcon from '../icons/ProfileIcon';
import ArrowIcon from '../icons/ArrowIcon';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import CalendarInfoPane from './infoPanes/CalendarInfoPane';
import SessionsInfoPane from './infoPanes/SessionsInfoPane';

const PWALayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNavPaneOpen, setIsNavPaneOpen] = useState(false);
  const [isInfoPaneOpen, setIsInfoPaneOpen] = useState(false);
  const [paneData, setPaneData] = useState(null);
  const [overlayOpacity, setOverlayOpacity] = useState(0); // Control background color opacity

  const toggleNavPane = () => {
    setIsNavPaneOpen(!isNavPaneOpen);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleInfoPaneOpen = (data) => {
    setPaneData(data);
    setIsInfoPaneOpen(true); // Open the Info Pane
  };

  const handleInfoPaneClose = () => {
    setIsInfoPaneOpen(false);
    setTimeout(() => {
      setPaneData(null); // Clear pane data after the pane has closed
    }, 300); // Adjust the delay to match the pane's closing animation duration
  };

  useEffect(() => {
    document.body.style.backgroundColor = 'var(--background-color)';
    return () => {
      document.body.style.backgroundColor = 'var(--light)';
    };
  });

  // Reset the Info Pane when the location changes
  useEffect(() => {
    setIsInfoPaneOpen(false);
    setPaneData(null);
  }, [location.pathname]);

  useEffect(() => {
    if (isInfoPaneOpen && !!paneData) {
      setOverlayOpacity(1); // Set background color opacity to 0.5 when pane opens
    } else {
      setOverlayOpacity(0); // Set background color opacity to 0 when pane closes
    }
  }, [isInfoPaneOpen, paneData]);

  const getRightPaneContent = () => {
    switch (location.pathname) {
      case '/timeline/calendar':
        return <CalendarInfoPane data={paneData} isPWA={true} />;
      case '/timeline/sessions':
        return <SessionsInfoPane data={paneData} isPWA={true} />;
      case '/incidents/incident-history':
        return (
          <IncidentsInfoPane data={paneData} setIncidentData={setPaneData} />
        );
      case '/construction-sites':
        return (
          <ConstructionSitesInfoPane
            data={paneData}
            setSiteData={setPaneData}
          />
        );
      default:
        return null;
    }
  };

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
            context={{
              setPaneData: handleInfoPaneOpen,
              isPaneOpen: isInfoPaneOpen,
              setIsPaneOpen: setIsInfoPaneOpen, // Add this line
            }}
          />
        </main>

        <footer
          className={`${styles.footer} ${isNavPaneOpen && styles.navPaneOpen}`}
        >
          {/* Hamburger Icon */}
          <span
            className={`${styles.footerItem} ${isNavPaneOpen ? styles.active : ''}`}
            onClick={toggleNavPane}
          >
            <HamburgerIcon size='25px' />
          </span>

          {/* Home Icon */}
          <NavLink
            to='/dashboard'
            className={`${styles.footerItem} ${location.pathname === '/dashboard' && !isNavPaneOpen ? styles.active : ''}`}
            onClick={() => setIsNavPaneOpen(false)}
          >
            <HomeIcon />
          </NavLink>

          {/* Profile Icon */}
          <NavLink
            to='/settings'
            className={`${styles.footerItem} ${location.pathname === '/settings' && !isNavPaneOpen ? styles.active : ''}`}
            onClick={() => setIsNavPaneOpen(false)}
          >
            <ProfileIcon />
          </NavLink>
        </footer>
      </div>
      {/* Custom Overlay */}
      <div
        className={styles.paneOverlay}
        style={{
          backgroundColor: `rgba(204, 224, 230, ${overlayOpacity})`,
          transition: 'background-color 0.3s ease',
        }}
      />
      {/* Info Pane */}
      <SlidingPane
        className={`${styles.slidingPane} ${isInfoPaneOpen ? '' : styles.infoClose}`}
        overlayClassName={styles.defaultOverlay}
        isOpen={isInfoPaneOpen && !!paneData}
        from='bottom'
        width='100%'
        hideHeader={true}
        onRequestClose={handleInfoPaneClose}
      >
        <div
          className={styles.infoPaneBackButton}
          onClick={() =>
            isInfoPaneOpen ? setIsInfoPaneOpen(false) : handleBack()
          }
        >
          <ArrowIcon size='25px' />
        </div>

        {paneData && getRightPaneContent()}
      </SlidingPane>
    </div>
  );
};

export default PWALayout;
