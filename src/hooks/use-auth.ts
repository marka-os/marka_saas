import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { logout as logoutApi } from "@marka/lib/api";
import { useAuthStore, User } from "@marka/stores/auth-store";
import { getQueryFn } from "@marka/lib/queryClient";

export function useAuth() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Get auth state and actions
  const {
    user,
    token,
    isAuthenticated,
    isHydrated,
    login,
    logout: zustandLogout,
    updateUser,
  } = useAuthStore();

  // Track if this is the initial mount
  const isInitialMount = React.useRef(true);

  // Fetch user profile from API only after hydration and if authenticated
  const {
    data: apiUser,
    isLoading: apiLoading,
    error: apiError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["api/v1/auth/profile"],
    queryFn: getQueryFn<User>({ on401: "returnNull" }),
    retry: false,
    enabled: isHydrated && isAuthenticated && !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: Infinity, // Keep cached data until explicitly cleared
  });

  // Determine final auth state
  const finalUser = apiUser || user;
  const finalIsAuthenticated =
    isHydrated && isAuthenticated && (!!finalUser || isInitialMount.current);

  // Update zustand store when API user changes - MEMOIZED to prevent infinite loops
  React.useEffect(() => {
    if (apiUser && JSON.stringify(apiUser) !== JSON.stringify(user)) {
      updateUser(apiUser);
    }
  }, [apiUser, user, updateUser]);

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      zustandLogout();
      queryClient.clear();
      setLocation("/");
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      // Still clear local state even if server logout fails
      zustandLogout();
      queryClient.clear();
      setLocation("/");
    },
  });

  const logout = React.useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  // Login helper function - MEMOIZED to prevent re-renders
  const loginWithTokens = React.useCallback(
    (accessToken: string, userData: User) => {
      login(accessToken, userData);
    },
    [login]
  );

  // REMOVE or conditionally log to prevent spam
  // Only log when auth state actually changes, not on every render
  const prevAuthState = React.useRef({
    isHydrated: false,
    isAuthenticated: false,
    finalIsAuthenticated: false,
  });

  React.useEffect(() => {
    const currentState = {
      isHydrated,
      isAuthenticated,
      finalIsAuthenticated,
    };

    // Only log if state has actually changed
    if (
      currentState.isHydrated !== prevAuthState.current.isHydrated ||
      currentState.isAuthenticated !== prevAuthState.current.isAuthenticated ||
      currentState.finalIsAuthenticated !==
        prevAuthState.current.finalIsAuthenticated
    ) {
      console.log("Auth state changed:", {
        isHydrated,
        isAuthenticated,
        hasToken: !!token,
        hasUser: !!finalUser,
        apiError: !!apiError,
        apiLoading,
        finalIsAuthenticated,
        //  finalIsLoading,
      });

      prevAuthState.current = currentState;
    }
  }, [
    isHydrated,
    isAuthenticated,
    finalIsAuthenticated,
    token,
    finalUser,
    apiError,
    apiLoading,
    //   finalIsLoading,
  ]);

  // Update isInitialMount after first render
  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, []);

  // Calculate loading state
  const isLoading =
    !isHydrated || (isAuthenticated && apiLoading && !finalUser);

  return React.useMemo(
    () => ({
      user: finalUser,
      isLoading,
      isAuthenticated: finalIsAuthenticated,
      error: apiError,
      logout,
      isLoggingOut: logoutMutation.isPending,
      login: loginWithTokens,
      refetchUser,
      hasToken: !!token,
      isHydrated,
    }),
    [
      finalUser,
      isLoading,
      finalIsAuthenticated,
      apiError,
      logout,
      logoutMutation.isPending,
      loginWithTokens,
      refetchUser,
      token,
      isHydrated,
    ]
  );
}
