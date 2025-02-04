import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import NavPane from './Navpane';
import Header from './Header';
import styles from './Layout.module.css';

const Layout = () => {
  useEffect(() => {
    // When the layout is used, set the background color to --background-color
    document.body.style.backgroundColor = 'var(--background-color)';

    // Cleanup the style when leaving the layout
    return () => {
      document.body.style.backgroundColor = 'var(--light)'; // Set to --light for other routes
    };
  }, []);

  return (
    <div className={styles.layout}>
      <NavPane />
      <div className={styles.main}>
        <Header />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
