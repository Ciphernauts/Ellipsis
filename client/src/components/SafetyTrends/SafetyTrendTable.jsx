import styles from './SafetyTrendTable.module.css';
import ArrowIcon from '../icons/ArrowIcon'; // Import the ArrowIcon component

const SafetyTrendTable = ({ data }) => {
  if (!Array.isArray(data)) {
    console.error(
      "SafetyTrendTable Error: Expected 'data' to be an array, but received:",
      data
    );
    return <p>Error: Invalid data format.</p>;
  }

  return (
    <div className={styles.safetyTrendTable}>
      <h1>Safety Trend Data</h1>
      {data.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <table className={styles.trendTable}>
          <thead className={styles.tableHeader}>
            <tr className={styles.row}>
              <th>Timestamp</th>
              <th>Safety Score</th>
              <th>Growth</th>
              <th>Alert Count</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {data.map((entry, index) => {
              const isPositive = parseFloat(entry.Growth) > 0;

              return (
                <tr key={index} className={styles.row}>
                  <td className={styles.timestamp}>{entry.Timestamp}</td>
                  <td className={styles.safetyScore}>
                    {entry['Safety Score']}
                  </td>
                  <td
                    className={`${styles.growth} ${isPositive ? styles.positive : styles.negative}`}
                  >
                    <ArrowIcon
                      direction={isPositive ? 'up' : 'down'}
                      color={isPositive ? 'green' : 'red'}
                    />
                    {entry.Growth}
                  </td>
                  <td className={styles.alertCount}>{entry['Alert Count']}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SafetyTrendTable;
