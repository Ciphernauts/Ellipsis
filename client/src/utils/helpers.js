export const capitalizeFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const calculateAverageScore = (data) => {
  if (Array.isArray(data)) {
    return data.reduce((acc, item) => acc + item.value, 0) / data.length;
  } else if (typeof data === 'object' && data !== null) {
    const values = Object.values(data);
    return values.reduce((acc, value) => acc + value, 0) / values.length;
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
