import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const TOKEN_KEY =
  process.env.NEXT_PUBLIC_JWT_STORAGE_KEY || "auth_token";

const REFRESH_TOKEN_KEY = "refresh_token";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach access token to every request
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = Cookies.get(TOKEN_KEY);

    // console.log(
    //   `🔐 ${config.method?.toUpperCase()} ${config.url} | Token:`,
    //   token ? "YES" : "NO",
    // );

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// Refresh expired access token
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      originalRequest?._retry ||
      originalRequest?.url === "/token/" ||
      originalRequest?.url === "/token/refresh/"
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const refreshToken = Cookies.get(REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      Cookies.remove(TOKEN_KEY);
      Cookies.remove(REFRESH_TOKEN_KEY);

      return Promise.reject(error);
    }

    try {
      const response = await axios.post(
        `${API_URL}/token/refresh/`,
        {
          refresh: refreshToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const newAccessToken = response.data.access;

      if (!newAccessToken) {
        throw new Error("No access token returned");
      }

      Cookies.set(TOKEN_KEY, newAccessToken, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      Cookies.remove(TOKEN_KEY);
      Cookies.remove(REFRESH_TOKEN_KEY);

      return Promise.reject(refreshError);
    }
  },
);