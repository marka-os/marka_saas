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
    isAuthenticated: zustandAuthenticated,
    isLoading: zustandLoading,
    login,
    logout: zustandLogout,
    updateUser,
    initializeAuth, // Make sure this is included
  } = useAuthStore();

  // State to track if store has been rehydrated from localStorage
  const [isRehydrated, setIsRehydrated] = React.useState(false);

  // Wait for Zustand to rehydrate from localStorage
  React.useEffect(() => {
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      setIsRehydrated(true);
      initializeAuth(); // Re-initialize auth after hydration
    });

    // If already hydrated, set rehydrated to true
    if (useAuthStore.persist.hasHydrated()) {
      setIsRehydrated(true);
      initializeAuth();
    }

    return unsubscribe;
  }, [initializeAuth]);

  // Fetch user profile from API (complements zustand storage)
  const {
    data: apiUser,
    isLoading: apiLoading,
    error: apiError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["api/v1/auth/profile"],
    queryFn: getQueryFn<User>({ on401: "returnNull" }),
    retry: false,
    enabled: !!token && zustandAuthenticated && isRehydrated, // Only fetch if we have a token AND store is rehydrated
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Sync API user with zustand store
  const isLoading = !isRehydrated || zustandLoading || apiLoading;
  const currentUser = apiUser || user;
  const isAuthenticated =
    zustandAuthenticated && !!currentUser && !apiError && isRehydrated;

  // Update zustand store when API user changes
  React.useEffect(() => {
    if (apiUser && apiUser !== user) {
      updateUser(apiUser);
    }
  }, [apiUser, user, updateUser]);

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      // Clear zustand state
      zustandLogout();

      // Clear react-query cache
      queryClient.clear();

      // Redirect to home
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

  const logout = () => {
    logoutMutation.mutate();
  };

  // Login helper function
  const loginWithTokens = React.useCallback(
    (accessToken: string, userData: User) => {
      login(accessToken, userData);
      // Refetch user profile to ensure we have latest data
      refetchUser();
    },
    [login, refetchUser]
  );

  return {
    user: currentUser,
    isLoading,
    isAuthenticated,
    error: apiError,
    logout,
    isLoggingOut: logoutMutation.isPending,
    login: loginWithTokens,
    refetchUser,
    hasToken: !!token,
    isRehydrated, 
  };
}
