import { envConfig } from "@/config/env.config";
import axios from "axios";

const api = axios.create({
  baseURL: envConfig.apiUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized access");
    }
    return Promise.reject(error);
  },
);

export { api };
export default api;

