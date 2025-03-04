import { useParams, useNavigate } from 'react-router-dom';
import SafetyTrendGraph from '../components/SafetyTrends/SafetyTrendGraph';
import SafetyTrendTable from '../components/SafetyTrends/SafetyTrendTable';
import SafetyTrendData from '../data/SafetyTrendData.json';
import syncIcon from '../assets/sync_icon.svg';
import styles from './SafetyTrends.module.css';
import ArrowIcon from '../components/icons/ArrowIcon';

// Helper function to find a key case-insensitively and handle spaces/hyphens
const findKeyIgnoreCase = (obj, key) =>
  Object.keys(obj).find(
    (k) =>
      k.toLowerCase().replace(/-/g, ' ') ===
      key.toLowerCase().replace(/-/g, ' ')
  );

// Define categories with subcategories (Maintaining Correct Order)
const categories = {
  'ppe': ['Helmet', 'Footwear', 'Vest', 'Gloves'],
  'fall-protection': ['Scaffolding', 'Guardrails', 'Harnesses'],
};

const categoryOrder = ['ppe', 'fall-protection']; // Ensure correct category order

const SafetyTrend = () => {
  const { category, subcategory } = useParams();
  const navigate = useNavigate();

  // Find matching category and subcategory keys
  const matchedCategory = findKeyIgnoreCase(SafetyTrendData, category);
  const categoryData = SafetyTrendData[matchedCategory];

  const matchedSubcategory = categoryData
    ? findKeyIgnoreCase(categoryData, subcategory)
    : null;
  const subcategoryData = categoryData?.[matchedSubcategory];

  // Get display names or fallback to formatted category/subcategory names
  const categoryDisplayName =
    categoryData?.displayName ||
    (matchedCategory ? matchedCategory.replace('-', ' ') : '');
  const subcategoryDisplayName =
    subcategoryData?.displayName ||
    (matchedSubcategory ? matchedSubcategory.replace('-', ' ') : '');

  // Handle missing data
  if (!categoryData || !subcategoryData) {
    return <h2>Category or Subcategory not found.</h2>;
  }

  // Find the current category index
  const currentCategoryIndex = categoryOrder.indexOf(category);
  const subcategoryList = categories[category] || [];

  // Find the index of the current subcategory
  const currentIndex = subcategoryList.findIndex(
    (item) => item.toLowerCase() === subcategory.toLowerCase()
  );

  // Determine previous and next navigation targets
  let prevSubcategory = null;
  let prevCategory = category;
  let nextSubcategory = null;
  let nextCategory = category;

  if (currentIndex > 0) {
    // Previous subcategory within the same category
    prevSubcategory = subcategoryList[currentIndex - 1];
  } else if (currentCategoryIndex > 0) {
    // Move to the last subcategory of the previous category
    prevCategory = categoryOrder[currentCategoryIndex - 1];
    prevSubcategory =
      categories[prevCategory][categories[prevCategory].length - 1];
  }

  if (currentIndex < subcategoryList.length - 1) {
    // Next subcategory within the same category
    nextSubcategory = subcategoryList[currentIndex + 1];
  } else if (currentCategoryIndex < categoryOrder.length - 1) {
    // Move to the first subcategory of the next category
    nextCategory = categoryOrder[currentCategoryIndex + 1];
    nextSubcategory = categories[nextCategory][0];
  }

  return (
    <div className={styles.safetyTrendContainer}>
      <h1>
        {categoryDisplayName} : {subcategoryDisplayName}
      </h1>

      {/* Navigation Buttons */}
      <div className={styles.navButtons}>
        {prevSubcategory && (
          <button
            className={styles.navButton}
            onClick={() =>
              navigate(
                `/safety-trends/${prevCategory}/${prevSubcategory.toLowerCase()}`
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
                `/safety-trends/${nextCategory}/${nextSubcategory.toLowerCase()}`
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
        />
      </div>

      {/* Table Section */}
      <div className={styles.section}>
        <div className={styles.syncText}>
          <img src={syncIcon} alt='Sync Icon' className={styles.syncIcon} />
          <p>Next sync: 2025-03-03 10:45 AM</p>
        </div>
        <SafetyTrendTable data={subcategoryData?.tableData || []} />
      </div>
    </div>
  );
};

export default SafetyTrend;
