import PropTypes from 'prop-types';
import styles from './CustomArrows.module.css';
import ArrowIcon from './icons/ArrowIcon';

export function NextArrow(props) {
  const { hidden, news, onClick } = props;
  return (
    <div
      className={`${styles.customNextArrow} ${hidden ? styles.hide : ''} ${news ? styles.news : ''}`}
      onClick={onClick}
    >
      <ArrowIcon className={styles.arrow} />
    </div>
  );
}

NextArrow.propTypes = {
  hidden: PropTypes.bool,
  news: PropTypes.bool,
  onClick: PropTypes.func,
};

export function PrevArrow(props) {
  const { hidden, news, onClick } = props;
  return (
    <div
      className={`${styles.customPrevArrow} ${hidden ? styles.hide : ''} ${news ? styles.news : ''}`}
      onClick={onClick}
    >
      <ArrowIcon className={styles.arrow} />
    </div>
  );
}

PrevArrow.propTypes = {
  hidden: PropTypes.bool,
  news: PropTypes.bool,
  onClick: PropTypes.func,
};
