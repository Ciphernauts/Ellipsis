import styles from './HeroSection.module.css';
import BuildingGraphic from '../icons/BuildingGraphic.jsx';
import { Link } from 'react-router-dom';
import Button from '../Button';

export default function HeroSection() {
  return (
    <div className={styles.heroContainer}>
      <div className={`${'homepageSectionContainer'} ${styles.hero}`}>
        <BuildingGraphic className={styles.graphic} />
        <div>
          <h1>
            Smart Safety<br></br>Solutions for Smarter<br></br>Construction
          </h1>
          <p>
            Keep your workers safe with an AI-powered system for real-time
            hazard detection and compliance monitoring.
          </p>
          <Link to='/register'>
            <Button size='large' text='Get Started' />
          </Link>
        </div>
      </div>
    </div>
  );
}
