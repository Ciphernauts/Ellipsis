import styles from "./Layout.module.css";
import React from "react";
import NavPane from "./Navpane";
import Header from "./Header";
import { Outlet } from "react-router-dom"; // Import Outlet

export default function Layout() {
  return (
    <div className={styles.layout}>
      <NavPane />
      <div className={styles.main}>
        <Header />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
