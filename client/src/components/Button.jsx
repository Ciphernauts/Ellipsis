import { Link } from 'react-router-dom';
import styles from './Button.module.css';

export default function Button({
  size = 'medium',
  color = 'dark',
  fill = true,
  text = 'Button',
  to = null,
  onClick = null,
  className = '',
  icon = null,
  icon2 = null,
}) {
  const buttonClass = [
    styles.button,
    styles[size],
    styles[color],
    fill ? styles.filled : styles.outlined,
    icon && styles.icon,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {icon && <span className={styles.icon}>{icon}</span>}
      {text}
      {icon2 && <span className={styles.icon}>{icon2}</span>}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={buttonClass}>
        {content}
      </Link>
    );
  }

  return (
    <button className={buttonClass} onClick={onClick}>
      {content}
    </button>
  );
}
