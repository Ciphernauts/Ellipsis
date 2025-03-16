import { useState } from 'react';
import styles from './ComplianceBreakdown.module.css';
import GroupedComplianceBreakdown from './GroupedComplianceBreakdown';
import PieChartCard from './PieChartCard';
import ComplianceList from './ComplianceList';
import { calculateAverageScore } from '../../utils/helpers';
import {
  HelmetIcon,
  BootsIcon,
  VestIcon,
  GlovesIcon,
  ScaffoldingIcon,
  GuardrailsIcon,
  HarnessIcon,
} from '../icons/ComplianceIcons';

const icons = {
  helmet: <HelmetIcon />,
  footwear: <BootsIcon />,
  vest: <VestIcon />,
  gloves: <GlovesIcon />,
  scaffolding: <ScaffoldingIcon />,
  guardrails: <GuardrailsIcon />,
  harness: <HarnessIcon />,
};

export default function ComplianceBreakdown({
  data,
  className,
  isPWA = false,
}) {
  const [selectedOption, setSelectedOption] = useState('PPE Detection');

  const averageScorePPE = calculateAverageScore(data?.ppe);
  const averageScoreFall = calculateAverageScore(data?.fall);

  const pieChartConfig = [
    {
      title: 'PPE Detection',
      data: [
        { name: 'Total', value: 100 - averageScorePPE },
        { name: 'Score', value: averageScorePPE },
      ],
      color: 'var(--primary)',
      averageScore: averageScorePPE,
      description: 'Avg safety score',
    },
    {
      title: 'Fall Protection',
      data: [
        { name: 'Total', value: 100 - averageScoreFall },
        { name: 'Score', value: averageScoreFall },
      ],
      color: 'var(--secondary)',
      averageScore: averageScoreFall,
      description: 'Avg safety score',
    },
  ];

  const selectedData =
    selectedOption === 'PPE Detection' ? data.ppe : data.fall;

  return (
    <div
      className={`${styles.breakdown} ${className} ${isPWA ? styles.mobile : ''}`}
    >
      {isPWA ? (
        <>
          <div className={styles.avgs}>
            {pieChartConfig.map((config, index) => (
              <PieChartCard key={index} {...config} />
            ))}
          </div>
          <div className={styles.options}>
            {pieChartConfig.map((config) => (
              <span
                key={config.title}
                className={`${styles.option} ${
                  selectedOption === config.title ? styles.active : ''
                }`}
                onClick={() => setSelectedOption(config.title)}
              >
                {config.title}
              </span>
            ))}
          </div>
          <ComplianceList data={selectedData} icons={icons} />
        </>
      ) : (
        <>
          <GroupedComplianceBreakdown title='PPE Detection' data={data.ppe} />
          <GroupedComplianceBreakdown
            title='Fall Protection'
            data={data.fall}
          />
        </>
      )}
    </div>
  );
}
