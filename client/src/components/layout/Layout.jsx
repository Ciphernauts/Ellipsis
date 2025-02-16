import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import NavPane from './NavPane';
import Header from './Header';
import CalendarInfoPane from './infoPanes/CalendarInfoPane';
import SessionsInfoPane from './infoPanes/SessionsInfoPane';
import styles from './Layout.module.css';
import IncidentsInfoPane from './infoPanes/IncidentsInfoPane';

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
          <IncidentsInfoPane
            data={paneData}
            setIncidentData={setPaneData}
            setIsPaneOpen={setIsPaneOpen}
          />
        );
      case '/construction-sites':
        return <p>Construction Sites</p>;
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
          }}
        >
          {location.pathname !== '/timeline/calendar' && (
            <span
              className={styles.closeButton}
              onClick={() => setIsPaneOpen(false)}
            >
              <svg
                width='27px'
                height='27px'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z'
                  fill='var(--dark)'
                />
              </svg>
            </span>
          )}
          {getRightPaneContent()}
        </SlidingPane>
      )}
    </div>
  );
};

export default Layout;
