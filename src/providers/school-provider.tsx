import { useEffect, useRef, ReactNode } from "react";
import { useSchoolStore } from "@marka/stores/school-store";

interface SchoolProviderProps {
  children: ReactNode;
  /**
   * Whether to automatically fetch school data on mount
   * @default true
   */
  autoFetch?: boolean;
  /**
   * Callback when school data is successfully loaded
   */
  onSchoolLoaded?: () => void;
  /**
   * Callback when school fetch fails
   */
  onSchoolError?: (error: Error) => void;
  /**
   * Auto-refresh interval in milliseconds (0 to disable)
   * @default 0
   */
  refreshInterval?: number;
}

/**
 * SchoolProvider - Application-level component that manages school state initialization
 *
 * This component should be placed near the root of your application (after auth)
 * to ensure school data is loaded and available throughout the app.
 *
 * @example
 * ```tsx
 * <AuthProvider>
 *   <SchoolProvider autoFetch refreshInterval={60000}>
 *     <App />
 *   </SchoolProvider>
 * </AuthProvider>
 * ```
 */
export function SchoolProvider({
  children,
  autoFetch = true,
  onSchoolLoaded,
  onSchoolError,
  refreshInterval = 0,
}: SchoolProviderProps) {
  const { fetchSchool, isInitialized, school, error } = useSchoolStore();
  const initAttemptedRef = useRef(false);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initial fetch
  useEffect(() => {
    if (!autoFetch || isInitialized || initAttemptedRef.current) {
      return;
    }

    initAttemptedRef.current = true;

    const initialize = async () => {
      try {
        await fetchSchool();
        onSchoolLoaded?.();
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to load school");
        console.error("[SchoolProvider] Failed to initialize:", error);
        onSchoolError?.(error);
      }
    };

    initialize();
  }, [autoFetch, isInitialized, fetchSchool, onSchoolLoaded, onSchoolError]);

  // Auto-refresh interval
  useEffect(() => {
    if (!refreshInterval || refreshInterval <= 0 || !isInitialized) {
      return;
    }

    refreshIntervalRef.current = setInterval(() => {
      fetchSchool().catch((err) => {
        console.error("[SchoolProvider] Auto-refresh failed:", err);
      });
    }, refreshInterval);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [refreshInterval, isInitialized, fetchSchool]);

  // Notify on school changes
  useEffect(() => {
    if (school && isInitialized) {
      onSchoolLoaded?.();
    }
  }, [school, isInitialized, onSchoolLoaded]);

  // Notify on errors
  useEffect(() => {
    if (error) {
      onSchoolError?.(error);
    }
  }, [error, onSchoolError]);

  return <>{children}</>;
}

/**
 * Hook to check if SchoolProvider is properly initialized
 */
/**export function useSchoolProviderStatus() {
  const { isInitialized, isLoading, error, school } = useSchoolStore();

  return {
    isReady: isInitialized && !isLoading,
    isInitialized,
    isLoading,
    hasError: !!error,
    error,
    hasSchool: !!school,
  };
}*/
