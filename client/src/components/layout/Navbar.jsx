import styles from "./Navbar.module.css";
import Logo from "../icons/Logo";
import Button from "../Button";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className={styles.navbar}>
      <div className={styles.brand}>
        <Logo size={50} />
        <p className={styles.logoName}>Ellipsis</p>
      </div>
      <div className={styles.navlinks}>
        <Link to="/services" className={styles.link}>
          Services
        </Link>
        <Link to="/about" className={styles.link}>
          About
        </Link>
        <Link to="/contact" className={styles.link}>
          Contact
        </Link>
        <Button color="primary" fill={false} text="Log In" to="/login" />
      </div>
    </div>
  );
}
