import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import styles from './Navbar.module.css';
import img from '../../assets/Full_line_black_png.png';
import Button from '../Button';

const Navbar = ({ scrollToSection, refs, homepage = true }) => {
  return (
    <div className={`${styles.navbar} ${!homepage && styles.bgTransparent}`}>
      <a href='/' className={styles.brand}>
        <img src={img} alt='' />
      </a>
      <div className={styles.navlinks}>
        {homepage ? (
          <>
            <a
              href='#services'
              className={styles.link}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(refs.servicesRef);
              }}
            >
              Services
            </a>
            <a
              href='#about'
              className={styles.link}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(refs.aboutRef, 20);
              }}
            >
              About
            </a>
            <a
              href='#contact'
              className={styles.link}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(refs.contactRef);
              }}
            >
              Contact
            </a>
          </>
        ) : (
          <Link to='/' className={styles.link}>
            Home
          </Link>
        )}

        <Button
          color='primary'
          fill={false}
          text='Log In'
          to='/login'
          className={styles.button}
        />
      </div>
    </div>
  );
};

export default Navbar;
