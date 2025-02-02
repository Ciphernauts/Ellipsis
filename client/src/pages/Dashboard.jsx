import SafetyScoreCard from "../components/dashboard/SafetyScoreCard";
import SafetyScoreTrends from "../components/dashboard/SafetyScoreTrends";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <h1>Dashboard</h1>
      <main>
        <div className={styles.row}>
          <SafetyScoreCard />
        </div>
      </main>
    </div>
  );
}
