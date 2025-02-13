import styles from './ComplianceBreakdown.module.css';
import GroupedComplianceBreakdown from './GroupedComplianceBreakdown';

export default function ComplianceBreakdown({ data }) {
  return (
    <div className={styles.breakdown}>
      <GroupedComplianceBreakdown title='PPE Detection' data={data.ppe} />
      <GroupedComplianceBreakdown title='Fall Protection' data={data.fall} />
    </div>
  );
}
