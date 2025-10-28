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

  // FIXED: Memoize updateUser to prevent it from changing on every render
  const stableUpdateUser = React.useCallback(updateUser, [updateUser]);

  // FIXED: Use a ref to track the last updated user to prevent infinite loops
  const lastUpdatedUserRef = React.useRef<string>("");

  // Update zustand store when API user changes - FIXED with better comparison and stability
  React.useEffect(() => {
    if (apiUser) {
      const currentUserString = JSON.stringify(apiUser);
      
      // Only update if the user data has actually changed
      if (currentUserString !== lastUpdatedUserRef.current) {
        lastUpdatedUserRef.current = currentUserString;
        stableUpdateUser(apiUser);
      }
    }
  }, [apiUser, stableUpdateUser]);

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

  // FIXED: Only log when auth state actually changes, not on every render
  const prevAuthState = React.useRef({
    isHydrated: false,
    isAuthenticated: false,
    finalIsAuthenticated: false,
    hasToken: false,
    hasUser: false,
  });

  React.useEffect(() => {
    const currentState = {
      isHydrated,
      isAuthenticated,
      finalIsAuthenticated,
      hasToken: !!token,
      hasUser: !!finalUser,
    };

    // Only log if state has actually changed
    const hasStateChanged = Object.keys(currentState).some(
      (key) => currentState[key as keyof typeof currentState] !== 
               prevAuthState.current[key as keyof typeof prevAuthState.current]
    );

    if (hasStateChanged) {
      console.log("Auth state changed:", {
        isHydrated,
        isAuthenticated,
        hasToken: !!token,
        hasUser: !!finalUser,
        apiError: !!apiError,
        apiLoading,
        finalIsAuthenticated,
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