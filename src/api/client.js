// client.js
// Central place that knows how to talk to the backend, so nothing else
// has to remember the base URL or repeat setup
import axios from "axios";
import { getToken } from "../auth";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Before every request, attach the saved token if we have one
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;