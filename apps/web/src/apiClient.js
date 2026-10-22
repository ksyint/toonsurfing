import axios from "axios";

const host =
  window.location.hostname === "localhost"
    ? "http://1.215.235.253:17000"
    : "/api";

export const apiClient = axios.create({
  baseURL: host,
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
