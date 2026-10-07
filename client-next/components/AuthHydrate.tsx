"use client";

import { axiosInstance } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/authStore";
import { useEffect } from "react";

export default function AuthHydrate() {
  const hydrate = useAuthStore((state) => state.hydrate);
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!token) return;

    const loadUser = async () => {
      try {
        const response = await axiosInstance.get("/me/");
        setUser(response.data);
      } catch (error) {
        console.error("Failed to restore session:", error);
      }
    };

    loadUser();
  }, [token, setUser]);

  return null;
}