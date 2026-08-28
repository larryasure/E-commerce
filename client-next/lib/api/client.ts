import { ApiResponse } from "@/lib/types"; 

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN_KEY = process.env.NEXT_PUBLIC_JWT_STORAGE_KEY || "token"; 

interface FetchOptions extends RequestInit {
  token?: string;
}

export async function apiCall<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { token, ...fetchOptions } = options;
  const url = `${API_URL}${endpoint}`;

  const requestHeaders = new Headers({
    "Content-Type": "application/json",
    ...fetchOptions.headers,
  });

  let activeToken = token;

  if (!activeToken && typeof window === "undefined") {
    const { cookies } = await import("next/headers");
    activeToken = (await cookies()).get(TOKEN_KEY)?.value;
  } else if (!activeToken && typeof document !== "undefined") {
    activeToken = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith(`${TOKEN_KEY}=`))
      ?.split("=")[1];
  }

  if (activeToken) {
    requestHeaders.set("Authorization", `Bearer ${activeToken}`);
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers: requestHeaders,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const result: ApiResponse<T> = await response.json();
  return result.data;
}

export const api = {
  get: <T>(endpoint: string, option?: FetchOptions) =>
    apiCall<T>(endpoint, { method: "GET", ...option }),

  post: <T>(endpoint: string, body: unknown, options?: FetchOptions) =>
    apiCall<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      ...options,
    }),

  patch: <T>(endpoint: string, body: unknown, options?: FetchOptions) =>
    apiCall<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
      ...options,
    }),

  delete: <T>(endpoint: string, options?: FetchOptions) =>
    apiCall<T>(endpoint, { method: "DELETE", ...options }),
};
