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

  // Fetch user profile from API only after hydration and if authenticated
  const {
    data: apiUser,
    isLoading: apiLoading,
    error: apiError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["api/v1/auth/profile"],
    queryFn: getQueryFn<User>({ on401: "returnNull" }),
    retry: 1,
    retryDelay: 1000,
    enabled: isHydrated && isAuthenticated && !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // Keep cached data for 10 minutes
  });

  // Determine final auth state - optimized to prevent blank screens
  const finalIsLoading = !isHydrated;
  const finalUser = apiUser || user;
  const finalIsAuthenticated =
    isHydrated && (isAuthenticated || (!!finalUser && (!apiLoading || !!user)));

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
        finalIsLoading,
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
    finalIsLoading,
  ]);

  // Memoize the return object to prevent unnecessary re-renders
  // Combine all loading states
  const combinedIsLoading = finalIsLoading || apiLoading;
  const combinedIsAuthenticated = finalIsAuthenticated && !combinedIsLoading;

  return React.useMemo(
    () => ({
      user: finalUser,
      isLoading: combinedIsLoading,
      isAuthenticated: combinedIsAuthenticated,
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
      combinedIsLoading,
      combinedIsAuthenticated,
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
