"use client";

import { useAuthStore } from "@/lib/stores/authStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "user";
}

export default function ProtectedRoute({
  children,
  requiredRole = "user",
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, token, hydrate } = useAuthStore();
  
  // Local state flag tracking if storage checked finished reading from disk
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // If your Zustand store doesn't have an internal `_hasHydrated` state,
    // we use a .then() promise or run it inline here to safety flag completion
    const checkAuth = async () => {
      await hydrate();
      setIsReady(true);
    };
    checkAuth();
  }, [hydrate]);

  useEffect(() => {
    // CRITICAL: Stop checking routing redirects until hydration finishes completely
    if (!isReady) return;

    if (!token) {
      router.push("/auth/login");
      return;
    }

    if (requiredRole === "admin" && !user?.is_staff) {
      router.push("/products");
    }
  }, [isReady, token, user, requiredRole, router]);

  // Display initialization interface screen while syncing disk data
  if (!isReady || (!token && isReady)) {
    return (
      <div className="min-h-[95vh] flex w-screen shadow-sm items-center justify-center bg-gray-50 mt-14">
        <div className="loading loading-infinity loading-xl">
          Loading your session please wait...
        </div>
      </div>
    );
  }

  if (requiredRole === "admin" && !user?.is_staff) {
    return (
      <div className="w-screen h-screen items-center flex justify-center mt-14 bg-gray-50 shadow-sm">
        <div className="text-gray-500 font-medium text-sm">Redirecting...</div>
      </div>
    );
  }

  return <>{children}</>;
}
