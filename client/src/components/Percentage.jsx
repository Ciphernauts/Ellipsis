import styles from './Percentage.module.css';
import { isPWA } from '../utils/isPWA';

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
  const isStandalone = isPWA();

  // Adjust font sizes if the app is in standalone mode
  const adjustedNumberSize = isStandalone ? numberSize - 2 : numberSize;
  const adjustedSymbolSize = isStandalone ? symbolSize - 2 : symbolSize;
  const adjustedLabelSize = isStandalone ? labelSize - 2 : labelSize;
  const adjustedLabel2size = isStandalone ? label2size - 2 : label2size;

  return (
    <div
      className={`${styles.percentage} ${className} ${
        label2 !== '' ? styles.hasLabel2 : ''
      } ${isStandalone ? styles.mobile : ''}`}
    >
      {label !== '' && (
        <div
          className={styles.label}
          style={{
            fontSize: adjustedLabelSize,
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
              fontSize: adjustedLabel2size,
              fontWeight: label2weight,
            }}
          >
            {label2}
          </span>
        )}
        <span
          className={styles.number}
          style={{
            fontSize: adjustedNumberSize,
            fontWeight: numberWeight,
          }}
        >
          {number}
        </span>
        <span
          className={styles.symbol}
          style={{
            fontSize: adjustedSymbolSize,
          }}
        >
          {symbol}
        </span>
      </div>
    </div>
  );
}
