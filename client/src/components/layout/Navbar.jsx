import styles from './Navbar.module.css';
import img from '../../assets/Icon_black_png.png';
import Button from '../Button';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className={styles.navbar}>
      <div className={styles.brand}>
        <img src={img} alt='' />
        <p className={styles.logoName}>Ellipsis</p>
      </div>
      <div className={styles.navlinks}>
        <Link to='/services' className={styles.link}>
          Services
        </Link>
        <Link to='/about' className={styles.link}>
          About
        </Link>
        <Link to='/contact' className={styles.link}>
          Contact
        </Link>
        <Button color='primary' fill={false} text='Log In' to='/login' />
      </div>
    </div>
  );
}
