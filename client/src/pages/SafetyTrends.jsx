import { useParams, useNavigate } from 'react-router-dom';
import SafetyTrendGraph from '../components/SafetyTrends/SafetyTrendGraph';
import SafetyTrendTable from '../components/SafetyTrends/SafetyTrendTable';
import SafetyTrendData from '../data/SafetyTrendData.json';
import syncIcon from '../assets/sync_icon.svg';
import styles from './SafetyTrends.module.css';
import ArrowIcon from '../components/icons/ArrowIcon';
import { capitalizeFirstLetter } from '../utils/helpers';

// Define categories with subcategories
const categories = {
  'ppe': ['Helmet', 'Footwear', 'Vest', 'Gloves'],
  'fall-protection': ['Scaffolding', 'Guardrails', 'Harness'],
};

const categoryOrder = ['ppe', 'fall-protection']; // Ensure correct category order

const SafetyTrends = ({ isPWA = false }) => {
  const { category, subcategory } = useParams();
  const navigate = useNavigate();

  // Find matching subcategory data
  const subcategoryData = SafetyTrendData[subcategory];

  // Handle missing data
  if (!subcategoryData) {
    return <h2>Subcategory not found.</h2>;
  }

  // Get display names or fallback to formatted category and subcategory names
  const categoryDisplayName = category?.replace('-', ' ');
  const subcategoryDisplayName = capitalizeFirstLetter(subcategory) + ' Safety';

  // Find the current category index
  const currentCategoryIndex = categoryOrder.indexOf(category);

  // Find the index of the current subcategory
  const subcategoryList = categories[category] || [];
  const currentIndex = subcategoryList.findIndex(
    (item) => item.toLowerCase() === subcategory.toLowerCase()
  );

  // Determine previous and next navigation targets
  const prevSubcategory =
    currentIndex > 0
      ? subcategoryList[currentIndex - 1]
      : currentCategoryIndex > 0
        ? categories[categoryOrder[currentCategoryIndex - 1]].slice(-1)[0]
        : null;

  const nextSubcategory =
    currentIndex < subcategoryList.length - 1
      ? subcategoryList[currentIndex + 1]
      : currentCategoryIndex < categoryOrder.length - 1
        ? categories[categoryOrder[currentCategoryIndex + 1]][0]
        : null;

  return (
    <div
      className={`${styles.safetyTrendContainer} ${isPWA ? styles.mobile : ''}`}
    >
      {/* Display both category and subcategory in the h1 */}
      <h1>
        {
          { 'ppe': 'PPE', 'fall protection': 'Fall Protection' }[
            categoryDisplayName
          ]
        }{' '}
        : {subcategoryDisplayName}
      </h1>

      {/* Navigation Buttons */}
      <div className={styles.navButtons}>
        {/* Back to Overall Safety Trends (only on Helmet page) */}
        {category === 'ppe' && subcategory.toLowerCase() === 'helmet' && (
          <button
            className={styles.navButton}
            onClick={() => navigate('/safety-trends')}
          >
            <ArrowIcon className={styles.leftArrow} />
            Back to Overall Safety
          </button>
        )}

        {prevSubcategory && (
          <button
            className={styles.navButton}
            onClick={() =>
              navigate(
                `/safety-trends/${categoryOrder[currentCategoryIndex > 0 ? currentCategoryIndex - 1 : 0]}/${prevSubcategory.toLowerCase()}`
              )
            }
          >
            <ArrowIcon className={styles.leftArrow} />
            Back to {prevSubcategory}
          </button>
        )}

        {nextSubcategory && (
          <button
            className={styles.navButton}
            onClick={() =>
              navigate(
                `/safety-trends/${categoryOrder[currentCategoryIndex < categoryOrder.length - 1 ? currentCategoryIndex + 1 : currentCategoryIndex]}/${nextSubcategory.toLowerCase()}`
              )
            }
          >
            View {nextSubcategory}
            <ArrowIcon className={styles.rightArrow} />
          </button>
        )}
      </div>

      {/* Graph Section */}
      <div className={styles.section}>
        <div className={styles.syncText}>
          <img src={syncIcon} alt='Sync Icon' className={styles.syncIcon} />
          <p>Last synced: 2025-03-03 10:15 AM</p>
        </div>
        <SafetyTrendGraph
          data={subcategoryData?.data || []}
          category={subcategoryDisplayName}
          isPWA={isPWA}
        />
      </div>

      {/* Table Section */}
      <div className={styles.section}>
        <div className={`${styles.syncText} ${styles.tableSyncText}`}>
          <img src={syncIcon} alt='Sync Icon' className={styles.syncIcon} />
          <p>Next sync: 2025-03-03 10:45 AM</p>
        </div>
        <SafetyTrendTable
          data={subcategoryData?.tableData || []}
          isPWA={isPWA}
        />
      </div>
    </div>
  );
};

export default SafetyTrends;
