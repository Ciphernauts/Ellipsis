export const capitalizeFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const calculateAverageScore = (data) =>
  data.reduce((acc, item) => acc + item.value, 0) / data.length;

export const mapToPieData = (data) =>
  data.map((item) => ({
    name: item.name,
    pieData: [
      { name: 'Total', value: 100 - item.value },
      { name: 'Score', value: item.value },
    ],
  }));