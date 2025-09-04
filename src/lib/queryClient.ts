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

/**
 * Make an API request to the specified URL with the given method and data.
 * The request is made with the currently stored access token, if any.
 * The response is checked for OK status, and an error is thrown if it is not.
 * @param method The HTTP method to use.
 * @param url The URL to request.
 * @param data The data to send in the request body.
 * @returns The response.
 * @throws An error if the response is not OK.
 */
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined
): Promise<Response> {
  const token = useAuthStore.getState().token;
  const res = await fetch(url, {
    method,
    headers: {
      ...(data ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  //Auto-logout on 401
  if (res.status === 401) {
    useAuthStore.getState().logout();
  }

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
/**
 * Create a query function that can be used with React Query.
 *
 * @param options.on401 The behavior when the API returns a 401 Unauthorized
 *                      response.
 *                      - "returnNull": Return null as the result of the query.
 *                      - "throw": Throw an error.
 * @returns A query function that can be used with React Query.
 */
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const token = useAuthStore.getState().token;
    const url = queryKey.join("/");
    const res = await fetch(url, {
        headers: token ? {'Authorization': `Bearer ${token}`} : {},
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    //Auto-logout on 401
    if (res.status === 401) {
      useAuthStore.getState().logout();
    }

    await throwIfResNotOk(res);
    return await res.json();
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
