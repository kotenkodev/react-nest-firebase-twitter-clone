import axios from "axios";

const apiClient = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });

apiClient.interceptors.request.use((config) => {
  const requestUrl = config.url;
  return config;
});

apiClient.interceptors.response.use((response) => {
  console.log(`URL: ${response.config.url}`);
  return response;
});

export default apiClient;
