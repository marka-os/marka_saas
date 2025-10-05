import { useCallback } from "react";
import { useSchoolStore } from "@marka/stores/school-store";
import type { InsertSchool } from "@marka/types/api";

/**
 * Hook that provides all school actions with proper error handling and callbacks
 * This abstracts the store actions for easier component usage
 */
export function useSchoolActions() {
  const store = useSchoolStore();

  /**
   * Create a new school with comprehensive error handling
   */
  const createSchool = useCallback(
    async (
      data: InsertSchool,
      callbacks?: {
        onSuccess?: () => void;
        onError?: (error: Error) => void;
      }
    ) => {
      try {
        await store.createSchool(data);
        callbacks?.onSuccess?.();
      } catch (error) {
        const err =
          error instanceof Error ? error : new Error("Failed to create school");
        callbacks?.onError?.(err);
        throw err;
      }
    },
    [store]
  );

  /**
   * Update existing school with optimistic updates
   */
  const updateSchool = useCallback(
    async (
      data: Partial<InsertSchool>,
      callbacks?: {
        onSuccess?: () => void;
        onError?: (error: Error) => void;
      }
    ) => {
      try {
        await store.updateSchool(data);
        callbacks?.onSuccess?.();
      } catch (error) {
        const err =
          error instanceof Error ? error : new Error("Failed to update school");
        callbacks?.onError?.(err);
        throw err;
      }
    },
    [store]
  );

  /**
   * Delete school with confirmation
   */
  const deleteSchool = useCallback(
    async (callbacks?: {
      onSuccess?: () => void;
      onError?: (error: Error) => void;
    }) => {
      try {
        await store.deleteSchool();
        callbacks?.onSuccess?.();
      } catch (error) {
        const err =
          error instanceof Error ? error : new Error("Failed to delete school");
        callbacks?.onError?.(err);
        throw err;
      }
    },
    [store]
  );

  /**
   * Refresh school data from server
   */
  const refreshSchool = useCallback(
    async (callbacks?: {
      onSuccess?: () => void;
      onError?: (error: Error) => void;
    }) => {
      try {
        await store.refreshSchool();
        callbacks?.onSuccess?.();
      } catch (error) {
        const err =
          error instanceof Error
            ? error
            : new Error("Failed to refresh school");
        callbacks?.onError?.(err);
        throw err;
      }
    },
    [store]
  );

  /**
   * Initialize school data
   */
  const initializeSchool = useCallback(
    async (callbacks?: {
      onSuccess?: () => void;
      onError?: (error: Error) => void;
    }) => {
      if (store.isInitialized) {
        return;
      }

      try {
        await store.fetchSchool();
        callbacks?.onSuccess?.();
      } catch (error) {
        const err =
          error instanceof Error
            ? error
            : new Error("Failed to initialize school");
        callbacks?.onError?.(err);
        throw err;
      }
    },
    [store]
  );

  return {
    createSchool,
    updateSchool,
    deleteSchool,
    refreshSchool,
    initializeSchool,
  };
}

/**
 * Hook for school validation
 */
export function useSchoolValidation() {
  const validateSchoolData = useSchoolStore(
    (state) => state.validateSchoolData
  );

  const validate = useCallback(
    (data: Partial<InsertSchool>) => {
      return validateSchoolData(data);
    },
    [validateSchoolData]
  );

  return { validate };
}

/**
 * Hook that provides school metadata
 */
export function useSchoolMetadata() {
  const metadata = useSchoolStore((state) => ({
    lastFetchedAt: state.lastFetchedAt,
    lastModifiedAt: state.lastModifiedAt,
    syncStatus: state.syncStatus,
    isInitialized: state.isInitialized,
    operationInProgress: state.operationInProgress,
  }));

  return metadata;
}

/**
 * Hook for checking school capabilities
 */
export function useSchoolCapabilities() {
  const capabilities = useSchoolStore((state) => ({
    hasSchool: state.hasSchool(),
    canCreateSchool: state.canCreateSchool(),
    schoolId: state.getSchoolId(),
  }));

  return capabilities;
}
