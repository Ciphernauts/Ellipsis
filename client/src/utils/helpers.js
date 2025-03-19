export const capitalizeFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const capitalizeWords = (str) => {
  return str
    .split(' ')
    .map((word) => {
      return capitalizeFirstLetter(word);
    })
    .join(' ');
};

export const calculateAverageScore = (data) => {
  if (Array.isArray(data)) {
    // Filter out null or undefined values from the array
    const filteredData = data.filter((item) => item.value != null);
    return filteredData.length > 0
      ? filteredData.reduce((acc, item) => acc + item.value, 0) /
          filteredData.length
      : 0; // Return 0 if no valid values
  } else if (typeof data === 'object' && data !== null) {
    const values = Object.values(data).filter((value) => value != null); // Filter out null or undefined values
    return values.length > 0
      ? values.reduce((acc, value) => acc + value, 0) / values.length
      : 0; // Return 0 if no valid values
  }
  return 0; // Fallback for invalid data
};
export const mapToPieData = (data) =>
  data.map((item) => ({
    name: item.name,
    pieData: [
      { name: 'Total', value: 100 - item.value },
      { name: 'Score', value: item.value },
    ],
  }));

export const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
};

export const formatDate = (dateString, format = 'default') => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const daySuffix = getDaySuffix(day);

  switch (format) {
    case 'veryshort':
      return `${day} ${month.slice(0, 3)}`;
    case 'short':
      return `${day}${daySuffix} ${month} ${time}`;
    case 'long':
      return `${day}${daySuffix} ${month} ${year} ${time}`;
    case 'dateOnly':
      return `${day}${daySuffix} ${month} ${year}`;
    case 'dateCode':
      const dayPadded = String(day).padStart(2, '0');
      const monthPadded = String(date.getMonth() + 1).padStart(2, '0');
      return `${dayPadded}-${monthPadded}-${year}`;
    default:
      return `${day}${daySuffix} ${month} ${year} ${time}`;
  }
};

export const getDaySuffix = (day) => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const incidentCategoryToNameMap = {
  Helmet: 'Missing helmet',
  Shoes: 'Improper footwear',
  Footwear: 'Improper footwear',
  Vest: 'Missing vest',
  Gloves: 'Missing gloves',
  Scaffolding: 'Improper scaffolding',
  Guardrail: 'Missing guardrails',
  Harness: 'Missing harness',
  helmet: 'Missing helmet',
  shoes: 'Improper footwear',
  footwear: 'Improper footwear',
  vest: 'Missing vest',
  gloves: 'Missing gloves',
  scaffolding: 'Improper scaffolding',
  guardrail: 'Missing guardrails',
  harness: 'Missing harness',
};

export const incidentCategoryToDescMap = {
  Helmet: 'Head protection missing or not worn properly.',
  Footwear: 'Unsafe or improper footwear detected.',
  Vest: 'High-visibility vest missing or not worn.',
  Gloves: 'Hand protection missing or inadequate.',
  Scaffolding:
    'Scaffolding structure detected with instability or improper assembly.',
  Guardrail: 'Safety guardrails missing or improperly installed.',
  Harness: 'Fall protection harness missing or improperly secured.',
};
