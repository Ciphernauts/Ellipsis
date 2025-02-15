import styles from './Percentage.module.css';

export default function Percentage({
  number = 0,
  label = '',
  numberSize = 34,
  numberWeight = 800,
  symbol = '%',
  symbolSize = 14,
  labelSize = 12,
  labelWeight = 500,
  label2 = '',
  label2size = 12,
  label2weight = 600,
  className = '',
}) {
  return (
    <div
      className={`${styles.percentage} ${className} ${
        label2 !== '' ? styles.hasLabel2 : ''
      }`}
    >
      {label !== '' && (
        <div
          className={styles.label}
          style={{
            fontSize: labelSize,
            fontWeight: labelWeight,
          }}
        >
          {label}
        </div>
      )}
      <div>
        {label2 !== '' && (
          <span
            className={styles.label2}
            style={{
              fontSize: label2size,
              fontWeight: label2weight,
            }}
          >
            {label2}
          </span>
        )}
        <span
          className={styles.number}
          style={{
            fontSize: numberSize,
            fontWeight: numberWeight,
          }}
        >
          {number}
        </span>
        <span
          className={styles.symbol}
          style={{
            fontSize: symbolSize,
          }}
        >
          {symbol}
        </span>
      </div>
    </div>
  );
}
