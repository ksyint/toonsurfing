import axios from "axios";

export const apiBaseURL = (process.env.REACT_APP_API_URL || "/api").replace(/\/$/, "");

export const apiClient = axios.create({
  baseURL: apiBaseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
