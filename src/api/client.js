// Central place that knows how to talk to the backend, so nothing else
// has to remember the base URL or repeat setup
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export default apiClient;