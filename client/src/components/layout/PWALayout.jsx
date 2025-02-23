import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, NavLink } from 'react-router-dom'; // Import NavLink
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

const PWALayout = () => {
  const location = useLocation();
  const [isPaneOpen, setIsPaneOpen] = useState(false);
  const [paneData, setPaneData] = useState(null);
  const [isNavPaneOpen, setIsNavPaneOpen] = useState(false);

  // const showRightPane = [
  //   '/timeline/calendar',
  //   '/timeline/sessions',
  //   '/incidents/incident-history',
  //   '/construction-sites',
  // ].includes(location.pathname);

  const toggleNavPane = () => {
    setIsNavPaneOpen(!isNavPaneOpen); // Toggle NavPane visibility
  };

  // useEffect(() => {
  //   setPaneData(null);
  //   if (location.pathname === '/timeline/calendar') {
  //     setIsPaneOpen(true);
  //   } else {
  //     setIsPaneOpen(false);
  //   }
  // }, [location.pathname]);

  useEffect(() => {
    document.body.style.backgroundColor = 'var(--background-color)';
    return () => {
      document.body.style.backgroundColor = 'var(--light)';
    };
  });

  // const getRightPaneContent = () => {
  //   if (!showRightPane) return null;

  //   switch (location.pathname) {
  //     case '/timeline/calendar':
  //       return <CalendarInfoPane data={paneData} />;
  //     case '/timeline/sessions':
  //       return <SessionsInfoPane data={paneData} />;
  //     case '/incidents/incident-history':
  //       return (
  //         <IncidentsInfoPane data={paneData} setIncidentData={setPaneData} />
  //       );
  //     case '/construction-sites':
  //       return (
  //         <ConstructionSitesInfoPane
  //           data={paneData}
  //           setSiteData={setPaneData}
  //         />
  //       );
  //     default:
  //       return null;
  //   }
  // };

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
        <main className={styles.content}>
          <Outlet
            context={{
              setPaneData,
              setIsPaneOpen,
              isPaneOpen,
            }}
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
    </div>

    /* Right Sliding Pane */
    //   {showRightPane && (
    //     <SlidingPane
    //       className={styles.slidingPane}
    //       overlayClassName={styles.paneOverlay}
    //       isOpen={isPaneOpen}
    //       hideHeader={true}
    //       width="26vw"
    //       padding="66px 51px"
    //       onRequestClose={() => {
    //         setIsPaneOpen(false);
    //         setPaneData(null);
    //       }}
    //     >
    //       {location.pathname !== '/timeline/calendar' && (
    //         <span
    //           className={styles.closeButton}
    //           onClick={() => {
    //             setIsPaneOpen(false);
    //             setPaneData(null);
    //           }}
    //         >
    //           <CrossIcon size="25px" />
    //         </span>
    //       )}
    //       {getRightPaneContent()}
    //     </SlidingPane>
    //   )}
    // </div>
  );
};

export default PWALayout;
