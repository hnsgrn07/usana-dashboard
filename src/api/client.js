// client.js
// Central place that knows how to talk to the backend, so nothing else
// has to remember the base URL or repeat setup
import axios from "axios";
import { getToken } from "../auth";

const apiClient = axios.create({
  baseURL: "https://usana-ai-coach.onrender.com",
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;