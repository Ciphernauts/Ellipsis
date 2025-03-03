import { useParams } from 'react-router-dom';
import SafetyTrendGraph from '../components/SafetyTrends/SafetyTrendGraph';
import SafetyTrendTable from '../components/SafetyTrends/SafetyTrendTable';
import SafetyTrendData from '../data/SafetyTrendData.json';

// Helper function to find a key case-insensitively and handle spaces/hyphens
const findKeyIgnoreCase = (obj, key) =>
  Object.keys(obj).find(
    (k) =>
      k.toLowerCase().replace(/-/g, ' ') ===
      key.toLowerCase().replace(/-/g, ' ')
  );

const SafetyTrend = () => {
  const { category, subcategory } = useParams();

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

  // 🔍 Debugging Logs
  console.log('URL Params - Category:', category, 'Subcategory:', subcategory);
  console.log('Matched Category:', matchedCategory);
  console.log('Matched Subcategory:', matchedSubcategory);
  console.log('Category Data:', categoryData);
  console.log('Subcategory Data:', subcategoryData);

  // Handle missing data
  if (!categoryData || !subcategoryData) {
    return <h2>Category or Subcategory not found.</h2>;
  }

  return (
    <div>
      <h1>
        {categoryDisplayName} : {subcategoryDisplayName}
      </h1>
      <SafetyTrendGraph
        data={subcategoryData?.data || []}
        category={subcategoryDisplayName}
      />
      <SafetyTrendTable data={subcategoryData?.tableData || []} />
    </div>
  );
};

export default SafetyTrend;
