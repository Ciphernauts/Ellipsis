import { capitalizeFirstLetter } from '../../utils/helpers';
import ProgressBar from '../ProgressBar';
import styles from './ComplianceList.module.css';

export default function ComplianceList({ data, icons }) {
  return (
    <div className={`${styles.dataList} ${'dashboardCard'}`}>
      {data.map((item, index) => (
        <div key={index} className={styles.listItem}>
          <div className={styles.logo}>{icons[item.name]}</div>
          <div className={styles.content}>
            <div className={styles.topRow}>
              <span className={styles.complianceType}>
                {capitalizeFirstLetter(item.name)} compliance rate
              </span>
              <span className={styles.percentage}>{item.value}%</span>
            </div>
            <div className={styles.bottomRow}>
              <ProgressBar
                progress={item.value}
                width='100%'
                color='var(--secondary)'
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
