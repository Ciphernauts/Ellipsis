import styles from './GroupedComplianceBreakdown.module.css';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
  capitalizeFirstLetter,
  calculateAverageScore,
  mapToPieData,
} from '../../utils/helpers';
import Percentage from '../Percentage';
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
  vest: <VestIcon />,
  footwear: <BootsIcon />,
  gloves: <GlovesIcon />,
  scaffolding: <ScaffoldingIcon />,
  guardrails: <GuardrailsIcon />,
  harness: <HarnessIcon />,
};

const descriptions = {
  helmet: 'Helmet compliance rate',
  vest: 'Vest compliance rate',
  footwear: 'Safety belt compliance rate',
  gloves: 'Gloves compliance rate in workshops',
  scaffolding: 'Safe scaffolding rate',
  guardrails: 'Guardrail coverage rate on high edges',
  harness: 'Safety rope compliance rate at height',
};

export default function GroupedComplianceBreakdown({ title, data }) {
  const transformedData = mapToPieData(data);
  const averageScore = calculateAverageScore(data);

  const avgPieData = [
    { name: 'Total', value: 100 - averageScore },
    { name: 'Score', value: averageScore },
  ];

  return (
    <div className={`${'dashboardCard'} ${styles.card}`}>
      <div className={styles.titleCard}>
        <div>
          <div>
            <Percentage
              number={averageScore.toFixed(1)}
              numberSize={24}
              symbolSize={12}
              className={styles.percentage}
            />
            <PieChart
              width={120}
              height={90}
              margin={{ top: 17, right: 0, bottom: 0, left: 0 }}
            >
              <Pie
                data={avgPieData}
                innerRadius={42}
                outerRadius={55}
                cornerRadius={10}
                paddingAngle={-5}
                startAngle={225}
                endAngle={-45}
                stroke='none'
                dataKey='value'
              >
                <Cell fill='var(--light)' />
                <Cell fill='var(--neutral)' />
              </Pie>
            </PieChart>
          </div>
          <p>Avg safety score</p>
        </div>
        <h2>{title}</h2>
      </div>
      <div className={styles.complianceCards}>
        {transformedData.map((item, index) => (
          <div key={index} className={styles.complianceCard}>
            <div className={styles.complianceTitle}>
              <div className={styles.iconContainer}>{icons[item.name]}</div>
              <h3>{capitalizeFirstLetter(item.name)}</h3>
            </div>
            <div className={styles.complianceCardScore}>
              <Percentage
                number={item.pieData[1].value}
                numberSize={19}
                symbolSize={11}
                className={styles.percentage}
              />
              <PieChart
                width={90}
                height={90}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              >
                <Pie
                  data={item.pieData}
                  innerRadius={35}
                  outerRadius={45}
                  cornerRadius={10}
                  paddingAngle={-5}
                  startAngle={180}
                  endAngle={-180}
                  stroke='none'
                  dataKey='value'
                >
                  <Cell fill='var(--background-color)' />
                  <Cell
                    fill={
                      title === 'PPE Detection'
                        ? 'var(--secondary)'
                        : 'var(--primary)'
                    }
                  />
                </Pie>
              </PieChart>
            </div>
            <p className={styles.complianceCardDesc}>
              {descriptions[item.name]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
