import { signOut, updateTokens } from "@/features/auth/authSlice";
import { getRefreshToken, getToken } from "@/lib/tokenStorage";
import { store } from "@/store";
import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const axiosClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use((request: InternalAxiosRequestConfig) => {
  const token = getToken();
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

// Response interceptor — token refresh logic
let isRefreshing = false;
type QueueItem = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};
let failedQueue: QueueItem[] = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });
  failedQueue = [];
}

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: InternalAxiosRequestConfig & { _retry?: boolean } =
      error.config;

    // Only attempt refresh on 401 and only once per request.
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      store.dispatch(signOut());
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Another request is already refreshing — queue this one.
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await axios.post(
        `${BASE_URL}/users/refresh-token`,
        {},
        { headers: { "Refresh-Token": refreshToken } },
      );

      const { token: newToken, refreshToken: newRefreshToken } =
        response.data.data;

      // Persist and sync new tokens to Redux + storage.
      store.dispatch(
        updateTokens({ token: newToken, refreshToken: newRefreshToken }),
      );

      processQueue(null, newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return axiosClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      store.dispatch(signOut());
      window.location.replace("/auth/sign-in");
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

// HTTP method wrappers for cleaner API calls in the app.
type RequestParams = {
  path: string;
  reqBody?: object | FormData;
  params?: object;
  header?: Record<string, string>;
};

export const get = async ({
  path,
  params = {},
  header = {},
}: RequestParams) => {
  const response = await axiosClient.get(path, {
    params: { ...params },
    headers: { ...header },
  });
  return response.data;
};

export const post = async ({ path, reqBody, header = {} }: RequestParams) => {
  const response = await axiosClient.post(path, reqBody, {
    // When sending FormData, remove Content-Type so axios sets it automatically with the correct multipart boundary.
    headers: {
      "Content-Type":
        reqBody instanceof FormData ? undefined : "application/json",
      ...header,
    },
  });
  return response.data;
};

export const put = async ({ path, reqBody, header = {} }: RequestParams) => {
  const response = await axiosClient.put(path, reqBody, {
    // When sending FormData, remove Content-Type so axios sets it automatically with the correct multipart boundary.
    headers: {
      "Content-Type":
        reqBody instanceof FormData ? undefined : "application/json",
      ...header,
    },
  });
  return response.data;
};

export const patch = async ({ path, reqBody, header = {} }: RequestParams) => {
  const response = await axiosClient.patch(path, reqBody, {
    // When sending FormData, remove Content-Type so axios sets it automatically with the correct multipart boundary.
    headers: {
      "Content-Type":
        reqBody instanceof FormData ? undefined : "application/json",
      ...header,
    },
  });
  return response.data;
};

export default axiosClient;

export const deleteRequest = async ({ path, header = {} }: RequestParams) => {
  const response = await axiosClient.delete(path, {
    headers: { ...header },
  });
  return response.data;
};
