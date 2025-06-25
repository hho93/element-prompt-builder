import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://platform.api.simplifyx.app/api/v1",
  headers: {
    "Content-type": "application/json",
  },
});

apiClient.interceptors.request.use(async function (config) {
  return config;
});

export default apiClient;
