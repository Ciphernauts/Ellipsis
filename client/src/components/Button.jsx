import { Link } from 'react-router-dom';
import styles from './Button.module.css';

export default function Button({
  size = 'medium',
  color = 'dark',
  fill = true,
  text = 'Button',
  to = null,
  onClick = null,
}) {
  const buttonClass = [
    styles.button,
    styles[size],
    styles[color],
    fill ? styles.filled : styles.outlined,
  ]
    .filter(Boolean)
    .join(' ');

  if (to) {
    // Render as a Link if `to` is provided
    return (
      <Link to={to} className={buttonClass}>
        {text}
      </Link>
    );
  }

  // Render as a standard button if `to` is not provided
  return (
    <button className={buttonClass} onClick={onClick}>
      {text}
    </button>
  );
}
