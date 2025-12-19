import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5003/api" : "/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with the request
});

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle axios errors properly
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data?.message || 'Server error');
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Network error - please check your connection');
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);