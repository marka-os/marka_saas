import React from "react";
import { useLocation } from "wouter";
import { useAuth } from "@marka/hooks/use-auth";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  redirectTo = "/login",
}) => {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading, isHydrated } = useAuth();

  // Debug log for authentication state
  React.useEffect(() => {
    console.log("[AuthGuard] State:", {
      requireAuth,
      isAuthenticated,
      isLoading,
      isHydrated,
      redirectTo,
    });
  }, [requireAuth, isAuthenticated, isLoading, isHydrated, redirectTo]);

  // Redirect logic using useEffect at top level with debounced redirects
  React.useEffect(() => {
    // Don't redirect while loading or not hydrated
    if (!isHydrated || isLoading) {
      return;
    }

    // Handle protected route access
    if (requireAuth && !isAuthenticated) {
      const timer = setTimeout(() => {
        setLocation(redirectTo);
      }, 100); // Small delay to prevent flash
      return () => clearTimeout(timer);
    }

    // Handle public route access when authenticated
    if (!requireAuth && isAuthenticated) {
      const timer = setTimeout(() => {
        setLocation("/dashboard");
      }, 100); // Small delay to prevent flash
      return () => clearTimeout(timer);
    }
  }, [
    requireAuth,
    isAuthenticated,
    isHydrated,
    isLoading,
    redirectTo,
    setLocation,
  ]);

  // Only show loading spinner during initial load or when authentication state is changing
  if (!isHydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {!isHydrated ? "Loading..." : "Checking authentication..."}
          </p>
        </div>
      </div>
    );
  }

  // Handle authentication requirements
  if (requireAuth && !isAuthenticated && isHydrated && !isLoading) {
    // Show loading while redirecting
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Handle reverse auth (redirect authenticated users away from login/register)
  if (!requireAuth && isAuthenticated && isHydrated && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  // Render children if all conditions are met
  return <>{children}</>;
};
