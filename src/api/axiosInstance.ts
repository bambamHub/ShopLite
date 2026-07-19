import axios, { AxiosError } from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 10_000,
});

// Attach the JWT to every outgoing request. Token lives in localStorage
// (kept in sync by authSlice) so this works even before the store finishes hydrating.
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.code === "ECONNABORTED") {
      return Promise.reject(new ApiError("Request timed out. Please try again."));
    }

    if (!error.response) {
      return Promise.reject(new ApiError("Network error. Check your connection."));
    }

    const status = error.response.status;

    if (status === 401) {
      // Token is invalid or expired — clear auth and force a re-login.
      localStorage.removeItem("accessToken");
      window.dispatchEvent(new Event("auth:unauthorized"));
      return Promise.reject(new ApiError("Session expired. Please log in again.", 401));
    }

    const fallback =
      status === 404
        ? "The requested resource was not found."
        : status >= 500
          ? "Something went wrong on the server. Please try again later."
          : "Something went wrong.";

    return Promise.reject(new ApiError(error.response.data?.message ?? fallback, status));
  },
);
