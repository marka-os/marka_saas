import { useAuthStore } from "@marka/stores/auth-store";
import { QueryClient, type QueryFunction } from "@tanstack/react-query";

/**
 * Throw an error if the response is not OK.
 * @param res The response to check.
 * @throws An error if the response is not OK.
 */
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Use the deployed API URL from environment variables
const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL?.replace(/\/$/, "");

/**
 * Make an API request to the specified URL with the given method and data.
 */
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined
): Promise<Response> {
  console.log("Using API base URL:", BASE_URL);
  const token = useAuthStore.getState().token;

  // Ensure proper URL construction
  const cleanUrl = url.startsWith("/") ? url.slice(1) : url;
  const fullUrl = `${BASE_URL}/${cleanUrl}`;

  console.log("Making request to:", fullUrl);
  console.log("Request method:", method);
  console.log("Request data:", data);

  try {
    const res = await fetch(fullUrl, {
      method,
      headers: {
        ...(data ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        // Add CORS headers if needed for your deployed API
        Accept: "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
      // Remove credentials: "include" if your API doesn't support it
      mode: "cors",
    });

    console.log("Response status:", res.status);
    console.log("Response headers:", Object.fromEntries(res.headers.entries()));

    // Only auto-logout on 401 if we're not on the registration/login endpoints
    if (res.status === 401 && !url.includes("/auth/")) {
      useAuthStore.getState().logout();
    }

    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    console.error("API Request failed:", error);
    console.error("Full URL was:", fullUrl);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
/**
 * Create a query function that can be used with React Query.
 */
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const token = useAuthStore.getState().token;
    const url = `${BASE_URL}/${queryKey.join("/")}`;

    try {
      const res = await fetch(url, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          Accept: "application/json",
        },
        mode: "cors",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      // Only auto-logout on 401 if we're not on auth endpoints
      if (
        res.status === 401 &&
        !queryKey.some((key) => String(key).includes("auth"))
      ) {
        useAuthStore.getState().logout();
      }

      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
      console.error("Query failed for:", queryKey, error);
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
