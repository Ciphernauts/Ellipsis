import styles from "./Percentage.module.css";

export default function Percentage({
  number = 0,
  label = "label",
  numberSize = 34,
  numberWeight = 700,
  symbolSize = 14,
  labelSize = 12,
  labelWeight = 500,
  className = "",
}) {
  return (
    <div className={`${styles.percentage} ${className}`}>
      <div
        className={styles.label}
        style={{
          fontSize: labelSize,
          fontWeight: labelWeight,
        }}
      >
        {label}
      </div>
      <div>
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
          %
        </span>
      </div>
    </div>
  );
}
