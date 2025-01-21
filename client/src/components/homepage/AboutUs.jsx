import styles from './AboutUs.module.css';

export default function AboutUs() {
  return (
    <div className={styles.aboutus}>
      <h2>About Us</h2>
      <div className={styles.desc}>
        We are <b>The Ciphernauts</b>—a team of five Computer Science majors
        from the University of Wollongong in Dubai, united by our passion for
        technology and innovation. As part of our capstone project, we are
        developing an AI-powered computer vision system, combining machine
        learning with web and mobile development to create cutting-edge
        solutions. Each team member contributes unique expertise in computer
        vision, frontend, or backend development, working together with
        creativity, hard work, and a shared commitment to excellence. Guided by
        curiosity and a drive to innovate, we strive to push boundaries and turn
        complex ideas into impactful solutions.
      </div>
    </div>
  );
}
