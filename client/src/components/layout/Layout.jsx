import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import NavPane from './NavPane';
import Header from './Header';
import CalendarInfoPane from './infoPanes/CalendarInfoPane';
import SessionsInfoPane from './infoPanes/SessionsInfoPane';
import IncidentsInfoPane from './infoPanes/IncidentsInfoPane';
import ConstructionSitesInfoPane from './infoPanes/ConstructionSitesInfoPane';
import styles from './Layout.module.css';
import CrossIcon from '../icons/CrossIcon';

const Layout = () => {
  const location = useLocation();
  const [isPaneOpen, setIsPaneOpen] = useState(false);
  const [paneData, setPaneData] = useState(null);

  const showRightPane = [
    '/timeline/calendar',
    '/timeline/sessions',
    '/incidents/incident-history',
    '/construction-sites',
  ].includes(location.pathname);

  useEffect(() => {
    setPaneData(null);
    if (location.pathname === '/timeline/calendar') {
      setIsPaneOpen(true);
    } else {
      setIsPaneOpen(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.backgroundColor = 'var(--background-color)';
    return () => {
      document.body.style.backgroundColor = 'var(--light)';
    };
  });

  const getRightPaneContent = () => {
    if (!showRightPane) return null;

    switch (location.pathname) {
      case '/timeline/calendar':
        return <CalendarInfoPane data={paneData} />;
      case '/timeline/sessions':
        return <SessionsInfoPane data={paneData} />;
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
    <div className={styles.layout}>
      <NavPane />
      <div className={styles.main}>
        <Header
          showRightPane={isPaneOpen}
          className={`${styles.header} ${isPaneOpen ? styles.paneOpen : ''}`}
        />
        <main
          className={`${styles.content} ${isPaneOpen ? styles.paneOpen : ''}`}
        >
          <Outlet
            context={{
              setPaneData,
              setIsPaneOpen,
              isPaneOpen,
            }}
          />
        </main>
      </div>
      {showRightPane && (
        <SlidingPane
          className={styles.slidingPane}
          overlayClassName={styles.paneOverlay}
          isOpen={isPaneOpen}
          hideHeader={true}
          width='26vw'
          padding='66px 51px'
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
              <CrossIcon size='25px' />
            </span>
          )}
          {getRightPaneContent()}
        </SlidingPane>
      )}
    </div>
  );
};

export default Layout;
