import React, { PureComponent } from 'react';
import Percentage from '../Percentage';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import styles from './SafetyScoreCard.module.css';
import ProgressBar from '../ProgressBar';

export default function SafetyScoreCard({ data, isPWA = false }) {
  // Helper function to calculate the average of an object
  const calculateAverage = (values) => {
    const sum = Object.values(values).reduce((acc, value) => acc + value, 0);
    return sum / Object.values(values).length;
  };

  // Calculate PPE and Fall averages
  const ppeAvg = calculateAverage(data.ppe);
  const fallAvg = calculateAverage(data.fall);

  // Calculate the total average
  const totalAvg = ((ppeAvg + fallAvg) / 2).toFixed(1);

  // Calculate weighted averages for PPE and Fall
  const ppeWeighted = ((ppeAvg / (ppeAvg + fallAvg)) * totalAvg).toFixed(1);
  const fallWeighted = ((fallAvg / (ppeAvg + fallAvg)) * totalAvg).toFixed(1);

  const chartData = [
    { name: 'total', value: 100 - totalAvg },
    { name: 'fall', value: parseFloat(fallWeighted) },
    { name: 'ppe', value: parseFloat(ppeWeighted) },
  ];

  const COLORS = [
    'var(--background-color)',
    'var(--secondary)',
    'var(--primary)',
  ];

  return (
    <div
      className={`${!isPWA ? 'dashboardCard' : ''} ${styles.card} ${isPWA ? styles.mobile : ''}`}
    >
      {!isPWA && <h2>Safety Score Overview</h2>}
      <div className={styles.content}>
        <div className={styles.overall}>
          <Percentage
            number={totalAvg}
            label='Overall avg'
            className={styles.percentage}
          />
          <PieChart
            width={isPWA ? 200 : 160}
            height={isPWA ? 200 : 160}
            title='Safety Score'
          >
            <Pie
              data={chartData}
              innerRadius={isPWA ? 73 : 60}
              outerRadius={isPWA ? 100 : 80}
              cornerRadius={15}
              paddingAngle={-15}
              startAngle={-180}
              endAngle={180}
              stroke='none'
              dataKey='value'
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  style={{ outline: 'none' }}
                />
              ))}
            </Pie>
          </PieChart>
        </div>
        {isPWA && <h2>Safety Score Overview</h2>}
        {!isPWA && (
          <div className={styles.breakdown}>
            <div className={styles.section}>
              <Percentage
                number={ppeWeighted}
                label='PPE Detection'
                numberSize={22}
                symbolSize={16}
                labelWeight={600}
                className={styles.percentage}
              />
              <ProgressBar
                progress={ppeWeighted}
                className={styles.progressBar}
              />
            </div>
            <div className={styles.section}>
              <Percentage
                number={fallWeighted}
                label='Fall Protection'
                numberSize={22}
                symbolSize={16}
                labelWeight={600}
                className={styles.percentage}
              />
              <ProgressBar
                progress={fallWeighted}
                className={styles.progressBar}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
