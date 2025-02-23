import React from 'react';
import styles from './OnboardingPage.module.css';
import BuildingGraphic from '../components/icons/BuildingGraphic';
import Button from '../components/Button';

export default function OnboardingPage() {
  return (
    <div className={styles.onboarding}>
      <div className={styles.bgVector}>
        <svg
          width='100%'
          height='100%'
          viewBox='0 0 347 553'
          preserveAspectRatio='none'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <g opacity='0.5'>
            <path
              d='M470 104.5C470 197.56 394.56 273 301.5 273C208.44 273 133 197.56 133 104.5C133 11.44 208.44 -64 301.5 -64C394.56 -64 470 11.44 470 104.5Z'
              fill='#CCE0E6'
            />
            <path
              d='M209 430.5C215.317 473.385 207.169 507.509 174.5 536C112.699 589.896 -14.9349 497.337 1.49998 417C12.4049 363.694 52.6022 324.869 107 326C164.015 327.186 200.69 374.081 209 430.5Z'
              fill='#91D3ED'
            />
            <path
              d='M161 75.5C161 97.8675 142.868 116 120.5 116C98.1325 116 80 97.8675 80 75.5C80 53.1325 98.1325 35 120.5 35C142.868 35 161 53.1325 161 75.5Z'
              fill='#91D3ED'
            />
            <path
              d='M133.26 116.003C133.088 112.876 133 109.725 133 106.554C133 84.8309 137.111 64.0677 144.597 45C154.549 52.379 161 64.2134 161 77.5544C161 95.4635 149.376 110.658 133.26 116.003Z'
              fill='#7EBDD3'
            />
          </g>
        </svg>
      </div>
      <svg
        width='223'
        height='290'
        viewBox='0 0 223 290'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className={styles.buildingGraphic}
      >
        <path
          d='M75.5536 101.193C75.5031 97.5675 71.7317 95.1995 68.4445 96.7292L2.94475 127.21C1.15392 128.044 0.0215707 129.853 0.0550474 131.828L1.69255 228.433C1.72693 230.462 2.98383 232.268 4.87391 233.006L70.8643 258.762C74.1705 260.052 77.7311 257.583 77.6817 254.034L75.5536 101.193Z'
          fill='var(--dark)'
        />
        <path
          d='M153.29 7.84167C153.29 4.1859 149.495 1.76609 146.18 3.3085L80.7332 33.7648C78.9702 34.5852 77.8428 36.3534 77.8428 38.298V90.2861C77.8428 92.2307 78.9702 93.9988 80.7331 94.8193L93.1916 100.617C94.9546 101.438 96.082 103.206 96.082 105.15V264.256C96.082 266.316 97.3452 268.165 99.2641 268.914L146.472 287.339C149.75 288.619 153.29 286.201 153.29 282.681V7.84167Z'
          fill='var(--dark)'
        />
        <path
          d='M178.182 96.7825C174.867 95.2402 171.072 97.66 171.072 101.316V269.392C171.072 273.349 175.451 275.738 178.778 273.597L220.044 247.04C221.474 246.12 222.338 244.536 222.338 242.835V120.519C222.338 118.574 221.211 116.806 219.448 115.986L178.182 96.7825Z'
          fill='var(--primary)'
        />
      </svg>
      <div className={styles.desc}>
        <h1>Ellipsis</h1>
        <p>Smart Safety Solutions for Smarter Construction.</p>
        <div className={styles.buttonContainer}>
          <Button
            size='large'
            text='Get Started'
            color='primary'
            to='/register'
          />
        </div>
      </div>
    </div>
  );
}
