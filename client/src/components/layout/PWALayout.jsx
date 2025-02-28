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
import IncidentsInfoPane from './infoPanes/IncidentsInfoPane';

const PWALayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNavPaneOpen, setIsNavPaneOpen] = useState(false);
  const [isInfoPaneOpen, setIsInfoPaneOpen] = useState(false);
  const [paneData, setPaneData] = useState(null);
  const [overlayOpacity, setOverlayOpacity] = useState(0);

  const isIncidentsPageActive =
    location.pathname === '/incidents/incident-history';

  const toggleNavPane = () => setIsNavPaneOpen(!isNavPaneOpen);
  const handleBack = () => navigate(-1);

  const handleInfoPaneOpen = (data) => {
    setPaneData(data);
    setIsInfoPaneOpen(true);
  };

  const handleInfoPaneClose = () => {
    setIsInfoPaneOpen(false);
    setTimeout(() => setPaneData(null), 300);
  };

  useEffect(() => {
    document.body.style.backgroundColor = 'var(--background-color)';
    return () => {
      document.body.style.backgroundColor = 'var(--light)';
    };
  }, []);

  useEffect(() => {
    setIsInfoPaneOpen(false);
    setPaneData(null);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isInfoPaneOpen ? 'hidden' : 'visible';
    return () => {
      document.body.style.overflow = 'visible';
    };
  }, [isInfoPaneOpen]);

  useEffect(() => {
    setOverlayOpacity(isInfoPaneOpen && paneData ? 1 : 0);
  }, [isInfoPaneOpen, paneData]);

  const getRightPaneContent = () => {
    switch (location.pathname) {
      case '/timeline/calendar':
        return <CalendarInfoPane data={paneData} isPWA={true} />;
      case '/timeline/sessions':
        return <SessionsInfoPane data={paneData} isPWA={true} />;
      case '/incidents/incident-history':
        return (
          <IncidentsInfoPane
            data={paneData}
            setIncidentData={setPaneData}
            isPWA={true}
          />
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
      <div
        className={`${styles.navPaneOverlay} ${isNavPaneOpen && styles.active}`}
      >
        <NavPane
          isPWA={true}
          toggle={toggleNavPane}
          className={isNavPaneOpen ? styles.open : ''}
        />
      </div>

      <div
        className={`${styles.main} ${isInfoPaneOpen ? styles.mainInfoOpen : ''}`}
      >
        {!isInfoPaneOpen || (isIncidentsPageActive && isInfoPaneOpen) ? (
          <div
            className={`${styles.backButton} ${isInfoPaneOpen ? styles.fixedBackButton : ''}`}
            onClick={() =>
              isInfoPaneOpen ? handleInfoPaneClose() : handleBack()
            }
          >
            <ArrowIcon size='25px' />
          </div>
        ) : (
          <div
            className={styles.backButton}
            onClick={() => setIsInfoPaneOpen(false)}
          >
            <ArrowIcon size='25px' />
          </div>
        )}

        <main className={styles.content}>
          <Outlet
            context={{
              setPaneData: handleInfoPaneOpen,
              isPaneOpen: isInfoPaneOpen,
              setIsPaneOpen: setIsInfoPaneOpen,
            }}
          />
        </main>

        <footer
          className={`${styles.footer} ${isNavPaneOpen && styles.navPaneOpen}`}
        >
          <span
            className={`${styles.footerItem} ${isNavPaneOpen ? styles.active : ''}`}
            onClick={toggleNavPane}
          >
            <HamburgerIcon size='25px' />
          </span>
          <NavLink
            to='/dashboard'
            className={`${styles.footerItem} ${location.pathname === '/dashboard' && !isNavPaneOpen ? styles.active : ''}`}
            onClick={() => setIsNavPaneOpen(false)}
          >
            <HomeIcon />
          </NavLink>
          <NavLink
            to='/settings'
            className={`${styles.footerItem} ${location.pathname === '/settings' && !isNavPaneOpen ? styles.active : ''}`}
            onClick={() => setIsNavPaneOpen(false)}
          >
            <ProfileIcon />
          </NavLink>
        </footer>
      </div>

      {isInfoPaneOpen && isIncidentsPageActive ? (
        <div className={styles.imgOverlay}>
          {paneData?.snapshot ? (
            <img src={paneData.snapshot} alt='' />
          ) : (
            <p>No image available</p>
          )}
        </div>
      ) : (
        <div
          className={styles.paneOverlay}
          style={{
            backgroundColor: `rgba(204, 224, 230, ${overlayOpacity})`,
            transition: 'background-color 0.3s ease',
          }}
        />
      )}

      <SlidingPane
        className={`${isIncidentsPageActive ? styles.incidentSlidingPane : styles.slidingPane} ${isInfoPaneOpen ? '' : styles.infoClose}`}
        overlayClassName={`${styles.defaultOverlay} ${isIncidentsPageActive ? styles.incDefaultOverlay : ''}`}
        isOpen={isInfoPaneOpen && !!paneData}
        from='bottom'
        width='100%'
        hideHeader={true}
        onRequestClose={handleInfoPaneClose}
      >
        {!isIncidentsPageActive && (
          <div
            className={styles.infoPaneBackButton}
            onClick={() =>
              isInfoPaneOpen ? setIsInfoPaneOpen(false) : handleBack()
            }
          >
            <ArrowIcon size='25px' />
          </div>
        )}
        {isIncidentsPageActive ? (
          <div className={styles.insidePane}>
            {paneData && getRightPaneContent()}
          </div>
        ) : (
          paneData && getRightPaneContent()
        )}
      </SlidingPane>
    </div>
  );
};

export default PWALayout;
