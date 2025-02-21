import styles from './AboutUs.module.css';

export default function AboutUs() {
  const teamMembers = [
    {
      name: 'Aryan Malhotra',
      linkedinUrl: 'https://www.linkedin.com/in/aryan-malhotra-a64008279',
      githubUrl: 'https://github.com/Aryan-M-10',
      email: 'mailto:am407@uowmail.edu.au',
    },
    {
      name: 'Hadiyya Sakkir',
      linkedinUrl:
        'https://www.linkedin.com/in/hadiyya-s-mattummathodi-b345831a9',
      githubUrl: 'https://github.com/HadiyyaMattummathodi',
      email: 'mailto:hsshh999@uowmail.ac.au',
    },
    {
      name: 'Laxmi Biju',
      linkedinUrl: 'https://www.linkedin.com/in/laxmi-b-iu732/',
      githubUrl: 'https://github.com/Lemoneybaee',
      email: 'mailto:lb898@uowmail.edu.au',
    },
    {
      name: 'Mariah Khalifa',
      linkedinUrl: 'https://www.linkedin.com/in/mariah-khalifa',
      githubUrl: 'https://github.com/Mariah0-0',
      email: 'mailto:mak873@uowmail.edu.au',
    },
    {
      name: 'Nuraiman Hisham',
      linkedinUrl: 'https://www.linkedin.com/in/nuraiman-hisham-266022253',
      githubUrl: 'https://github.com/nuramnz',
      email: 'mailto:nbmh634@uowmail.edu.au',
    },
  ];

  return (
    <div className={styles.aboutusContainer}>
      <div className={`${'homepageSectionContainer'} ${styles.aboutus}`}>
        <h2>About Us</h2>
        <div className={styles.desc}>
          We are <b>The Ciphernauts</b>—a team of five Computer Science majors
          from the University of Wollongong in Dubai, united by our passion for
          technology and innovation. As part of our capstone project, we are
          developing an AI-powered computer vision system, combining machine
          learning with web and mobile development to create cutting-edge
          solutions.
        </div>
        <div className={styles.teamContainer}>
          {teamMembers.map((member, index) => (
            <div key={index} className={styles.memberCard}>
              <p className={styles.memberName}>{member.name}</p>
              <div className={styles.iconContainer}>
                <a
                  href={member.linkedinUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={styles.icon}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='26'
                    height='26'
                    viewBox='0 0 26 26'
                    fill='none'
                  >
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M26 26H20.8V16.9013C20.8 14.4053 19.6989 13.0127 17.7242 13.0127C15.5753 13.0127 14.3 14.4638 14.3 16.9013V26H9.1V9.1H14.3V11.0005C14.3 11.0005 15.9315 8.1377 19.6079 8.1377C23.2856 8.1377 26 10.3819 26 15.0255V26ZM3.1746 6.39717C1.4209 6.39717 0 4.96465 0 3.19795C0 1.43255 1.4209 0 3.1746 0C4.927 0 6.34789 1.43255 6.34789 3.19795C6.34919 4.96465 4.927 6.39717 3.1746 6.39717ZM0 26H6.5V9.1H0V26Z'
                      fill='var(--dark)'
                    />
                  </svg>
                </a>
                <a
                  href={member.githubUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={styles.icon}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='28'
                    height='30'
                    viewBox='0 0 28 30'
                    fill='none'
                  >
                    <path
                      d='M10.6154 24.2904C4.46154 26.1452 4.46154 21.1992 2 20.5809M19.2308 28V23.2147C19.2769 22.6251 19.1976 22.0323 18.9982 21.4759C18.7987 20.9194 18.4836 20.412 18.0738 19.9874C21.9385 19.5546 26 18.0831 26 11.3317C25.9997 9.60535 25.3387 7.94517 24.1538 6.6948C24.7149 5.1844 24.6752 3.51491 24.0431 2.03313C24.0431 2.03313 22.5908 1.60035 19.2308 3.86318C16.4099 3.09508 13.4363 3.09508 10.6154 3.86318C7.25538 1.60035 5.80308 2.03313 5.80308 2.03313C5.17092 3.51491 5.13125 5.1844 5.69231 6.6948C4.49862 7.95444 3.83695 9.62963 3.84615 11.3688C3.84615 18.0708 7.90769 19.5422 11.7723 20.0245C11.3674 20.4448 11.0551 20.9462 10.8558 21.4958C10.6564 22.0455 10.5745 22.6311 10.6154 23.2147V28'
                      stroke='var(--dark)'
                      strokeWidth='3'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </a>
                <a href={member.email} className={styles.icon}>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='28'
                    height='22'
                    viewBox='0 0 28 22'
                    fill='none'
                  >
                    <path
                      d='M2.8 22C2.03 22 1.37083 21.7307 0.8225 21.1922C0.274167 20.6536 0 20.0062 0 19.25V2.75C0 1.99375 0.274167 1.34635 0.8225 0.807813C1.37083 0.269271 2.03 0 2.8 0H25.2C25.97 0 26.6292 0.269271 27.1775 0.807813C27.7258 1.34635 28 1.99375 28 2.75V19.25C28 20.0062 27.7258 20.6536 27.1775 21.1922C26.6292 21.7307 25.97 22 25.2 22H2.8ZM14.5269 12.0321C14.2027 12.2427 13.7899 12.2461 13.4605 12.0438L2.8 5.5V19.25C2.8 19.25 25.2 19.6153 25.2 19.25C25.2 18.8847 25.2 5.93418 25.2 5.5C25.2 5.12274 16.7438 10.5919 14.5269 12.0321ZM13.4884 9.31099C13.8033 9.50426 14.1977 9.50896 14.5161 9.32153C16.774 7.99233 25.6504 2.75 25.2 2.75C24.6842 2.75 2.8 2.75 2.8 2.75L13.4884 9.31099ZM2.8 5.5V2.75V19.25V5.5Z'
                      fill='var(--dark)'
                    />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
