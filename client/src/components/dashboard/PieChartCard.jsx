import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Percentage from '../Percentage';
import styles from './PieChartCard.module.css';

export default function PieChartCard({
  title,
  data,
  color,
  averageScore,
  description,
}) {
  return (
    <div className={`${styles.pieChartCard} ${'dashboardCard'}`}>
      <h2>{title}</h2>
      <div>
        <Percentage
          number={averageScore}
          numberSize={24}
          symbolSize={12}
          className={styles.percentage}
        />
        <ResponsiveContainer width='100%' height={110}>
          <PieChart margin={{ top: 24, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={data}
              innerRadius={42}
              outerRadius={55}
              cornerRadius={10}
              paddingAngle={-5}
              startAngle={225}
              endAngle={-45}
              stroke='none'
              dataKey='value'
            >
              <Cell fill='var(--background-color)' />
              <Cell fill={color} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <p>{description}</p>
    </div>
  );
}
