const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://ellipsis-api.netlify.app";

export async function fetchData(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}/api/${endpoint}`, options);
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
}
