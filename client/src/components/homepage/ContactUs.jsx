import GithubIcon from '../icons/GithubIcon';
import InstagramIcon from '../icons/InstagramIcon';
import EmailIcon from '../icons/EmailIcon';
import styles from './ContactUs.module.css';

export default function ContactUs() {
  return (
    <div className={styles.contactUs}>
      <h2>Contact Us</h2>
      <div className={styles.socials}>
        <a
          href="https://www.instagram.com/ciphernauts/"
          target="_blank"
          className={styles.socialWrapper}
        >
          <span className={`${styles.social} ${styles.insta}`}>
            <svg
              width="60"
              height="60"
              viewBox="0 0 84 85"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M62.625 21.2904H62.6625M23.25 4.19043H60.75C71.1053 4.19043 79.5 12.697 79.5 23.1904V61.1904C79.5 71.6838 71.1053 80.1904 60.75 80.1904H23.25C12.8947 80.1904 4.5 71.6838 4.5 61.1904V23.1904C4.5 12.697 12.8947 4.19043 23.25 4.19043ZM57 39.7964C57.4628 42.959 56.9297 46.1889 55.4766 49.0267C54.0235 51.8645 51.7243 54.1658 48.9061 55.6032C46.0879 57.0406 42.8942 57.5409 39.7792 57.033C36.6642 56.525 33.7866 55.0347 31.5556 52.774C29.3247 50.5133 27.854 47.5974 27.3528 44.4408C26.8515 41.2843 27.3452 38.048 28.7637 35.1922C30.1822 32.3365 32.4532 30.0066 35.2537 28.5341C38.0542 27.0616 41.2416 26.5215 44.3625 26.9904C47.546 27.4688 50.4932 28.972 52.7689 31.278C55.0445 33.584 56.5279 36.5705 57 39.7964Z"
                stroke="var(--light)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>
        <a
          href="https://github.com/Ciphernauts/Ellipsis"
          target="_blank"
          className={styles.socialWrapper}
        >
          <span className={`${styles.social} ${styles.github}`}>
            <svg
              width="54"
              height="60"
              viewBox="0 0 79 85"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                id="Icon"
                d="M29.6282 69.3471C11.6795 74.7688 11.6795 60.311 4.5 58.5038M54.7564 80.1904V66.2026C54.8911 64.4791 54.6598 62.7465 54.078 61.1199C53.4962 59.4934 52.5772 58.0102 51.3821 56.7689C62.6538 55.5038 74.5 51.2027 74.5 31.4678C74.4991 26.4215 72.5712 21.5686 69.1154 17.9137C70.7518 13.4987 70.6361 8.61863 68.7923 4.28727C68.7923 4.28727 64.5564 3.02222 54.7564 9.63664C46.5288 7.39143 37.8559 7.39143 29.6282 9.63664C19.8282 3.02222 15.5923 4.28727 15.5923 4.28727C13.7485 8.61863 13.6328 13.4987 15.2692 17.9137C11.7876 21.5957 9.85777 26.4924 9.88462 31.5763C9.88462 51.1665 21.7308 55.4677 33.0026 56.8773C31.8215 58.1061 30.9107 59.5715 30.3293 61.1782C29.7479 62.7849 29.5091 64.4968 29.6282 66.2026V80.1904"
                stroke="var(--primary)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>
        <a
          href="mailto:ciphernauts@gmail.com"
          target="_blank"
          className={styles.socialWrapper}
        >
          <span className={`${styles.social} ${styles.email}`}>
            <svg
              width="60px"
              height="60px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7"
                stroke="var(--primary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2"
                stroke="var(--primary)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </a>
      </div>
    </div>
  );
}
