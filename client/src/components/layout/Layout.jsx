import styles from './Layout.module.css';
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import NavPane from './Navpane';
import Header from './Header';
import CalendarInfoPane from './infoPanes/CalendarInfoPane';

const Layout = () => {
  const location = useLocation();
  const [isPaneOpen, setIsPaneOpen] = useState(false);
  const [paneData, setPaneData] = useState(null);

  const showRightPane = [
    '/timeline/calendar',
    '/alert-history',
    '/construction-sites',
  ].includes(location.pathname);

  useEffect(() => {
    // Force the pane to always be open for /timeline/calendar
    if (location.pathname === '/timeline/calendar') {
      setIsPaneOpen(true);
    } else if (location.pathname === '/timeline/sessions') {
      setIsPaneOpen(false);
    } else if (location.pathname === '/alert-history') {
      setIsPaneOpen(false);
    } else if (location.pathname === '/construction-sites') {
      setIsPaneOpen(false);
    }
  }, [location.pathname]); // Re-run this when route changes

  useEffect(() => {
    document.body.style.backgroundColor = 'var(--background-color)';
    return () => {
      document.body.style.backgroundColor = 'var(--light)';
    };
  }, []);

  const getRightPaneContent = () => {
    switch (location.pathname) {
      case '/timeline/calendar':
        return <CalendarInfoPane data={paneData} />;
      case '/timeline/sessions':
        return <p>Sessions</p>;
      case '/alert-history':
        return <p>Recent Alerts</p>;
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
        <Header showRightPane={showRightPane} />
        <main className={styles.content}>
          <Outlet context={{ setPaneData }} />
          {showRightPane && location.pathname !== '/timeline/calendar' && (
            <button
              className={styles.toggleButton}
              onClick={() => setIsPaneOpen(true)}
            >
              Open Pane
            </button>
          )}
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
          onRequestClose={() =>
            location.pathname !== '/timeline/calendar' && setIsPaneOpen(false)
          }
        >
          {getRightPaneContent() || <div />}
        </SlidingPane>
      )}
    </div>
  );
};

export default Layout;
