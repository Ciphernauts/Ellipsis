import React from 'react';
import styles from './Navbar.module.css';
import img from '../../assets/Icon_black_png.png';
import Button from '../Button';

const Navbar = ({ scrollToSection, refs }) => {
  return (
    <div className={styles.navbar}>
      <a href='/' className={styles.brand}>
        <img src={img} alt='' />
        <p className={styles.logoName}>Ellipsis</p>
      </a>
      <div className={styles.navlinks}>
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
        <Button color='primary' fill={false} text='Log In' to='/login' />
      </div>
    </div>
  );
};

export default Navbar;
