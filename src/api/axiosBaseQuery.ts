import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { axiosInstance, ApiError } from "./axiosInstance";

type Args = {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  params?: Record<string, unknown>;
  data?: unknown;
};

// Lets RTK Query reuse our existing axios instance (and its interceptors)
// instead of shipping a second HTTP client just for fetchBaseQuery.
export const axiosBaseQuery: BaseQueryFn<Args, unknown, { status?: number; message: string }> =
  async ({ url, method = "GET", params, data }) => {
    try {
      const result = await axiosInstance.request({ url, method, params, data });
      return { data: result.data };
    } catch (err) {
      const error = err as ApiError;
      return { error: { status: error.status, message: error.message } };
    }
  };
