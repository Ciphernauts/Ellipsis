import styles from './ComplianceBreakdown.module.css';
import GroupedComplianceBreakdown from './GroupedComplianceBreakdown';

export default function ComplianceBreakdown() {
  const data = {
    ppe: [
      { name: 'helmet', value: 82.2 },
      { name: 'vest', value: 96.0 },
      { name: 'footwear', value: 95.4 },
      { name: 'gloves', value: 91.2 },
    ],
    fall: [
      { name: 'scaffolding', value: 75.0 },
      { name: 'guardrails', value: 85.4 },
      { name: 'harness', value: 91 },
    ],
  };

  return (
    <div className={styles.breakdown}>
      <GroupedComplianceBreakdown title='PPE Detection' data={data.ppe} />
      <GroupedComplianceBreakdown title='Fall Protection' data={data.fall} />
    </div>
  );
}
