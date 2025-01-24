import styles from "./Layout.module.css";
import React from "react";
import NavPane from "./Navpane";

export default function Layout({ children }) {
  return (
    <div className={styles.layout}>
      <NavPane />
      <main className="content">{children}</main>
    </div>
  );
}
