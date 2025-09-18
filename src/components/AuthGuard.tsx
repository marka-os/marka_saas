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

  // Track if component is mounted
  const isMounted = React.useRef(false);

  React.useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Debug log for authentication state
  React.useEffect(() => {
    console.log("[AuthGuard] State:", {
      requireAuth,
      isAuthenticated,
      isLoading,
      isHydrated,
      redirectTo,
      mounted: isMounted.current,
    });
  }, [requireAuth, isAuthenticated, isLoading, isHydrated, redirectTo]);

  // Redirect logic using useEffect
  React.useEffect(() => {
    if (!isMounted.current || isLoading) {
      return;
    }

    let redirectTimer: NodeJS.Timeout | null = null;

    if (requireAuth && !isAuthenticated && !isLoading) {
      redirectTimer = setTimeout(() => {
        if (isMounted.current) {
          setLocation(redirectTo);
        }
      }, 50);
    } else if (!requireAuth && isAuthenticated && !isLoading) {
      redirectTimer = setTimeout(() => {
        if (isMounted.current) {
          setLocation("/dashboard");
        }
      }, 50);
    }

    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
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
