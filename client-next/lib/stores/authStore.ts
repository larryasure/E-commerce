import { create } from "zustand";
import Cookies from "js-cookie";
import axios from "axios";

import {
  UserSerializer,
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from "@/lib/types/";
import { axiosInstance } from "../api/client";

interface AuthStore {
  user: UserSerializer | null;
  token: string | null;
  isLoading: boolean;
  isHydrated: boolean;

  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  setUser: (user: UserSerializer | null) => void;
  setToken: (token: string | null) => void;
  hydrate: () => Promise<void>;
}

const TOKEN_KEY =
  process.env.NEXT_PUBLIC_JWT_STORAGE_KEY || "auth_token";

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isHydrated: false,

  login: async (payload: LoginPayload) => {
    set({ isLoading: true });

    try {
      const response = await axios.post<AuthResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/token/`,
        payload,
      );

      const token = response.data.access;
      const refreshToken = response.data.refresh;

      if (!token) {
        throw new Error("No access token in response");
      }

      Cookies.set(TOKEN_KEY, token, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      if (refreshToken) {
        Cookies.set("refresh_token", refreshToken, {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
      }

      set({
        token,
        isHydrated: true,
      });

      const userResponse =
        await axiosInstance.get<UserSerializer>("/me/");

      set({
        user: userResponse.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({ isLoading: false });

      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        "Login failed";

      throw new Error(message);
    }
  },

  register: async (payload: RegisterPayload) => {
    set({ isLoading: true });

    try {
      await axiosInstance.post("/users/", payload);

      set({ isLoading: false });
    } catch (error: any) {
      set({ isLoading: false });

      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        "Registration failed";

      throw new Error(message);
    }
  },

  logout: () => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove("refresh_token");

    set({
      user: null,
      token: null,
      isHydrated: true,
    });
  },

  setUser: (user) => set({ user }),

  setToken: (token) =>
    set({
      token,
      isHydrated: true,
    }),

 hydrate: async () => {
  if (typeof window === "undefined") return;

  const token = Cookies.get(TOKEN_KEY);

  if (!token) {
    set({
      token: null,
      user: null,
      isHydrated: true,
    });
    return;
  }

  try {
    set({
      token,
      isHydrated: false,
    });

    const response = await axiosInstance.get<UserSerializer>("/me/");

    set({
      token,
      user: response.data,
      isHydrated: true,
    });
  } catch (error) {
    console.error("Failed to hydrate user:", error);

    Cookies.remove(TOKEN_KEY);
    Cookies.remove("refresh_token");

    set({
      token: null,
      user: null,
      isHydrated: true,
    });
  }
},

}));