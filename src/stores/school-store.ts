import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { School, InsertSchool } from "@marka/types/api";

/**
 * School store state interface
 * Manages the single school per tenant with comprehensive state tracking
 */
interface SchoolState {
  // Core state
  school: School | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: Error | null;

  // Operation tracking
  operationInProgress: {
    type: "create" | "update" | "delete" | null;
    startedAt: number | null;
  };

  // Optimistic update tracking
  optimisticUpdate: {
    previousSchool: School | null;
    isActive: boolean;
  };

  // Metadata
  lastFetchedAt: number | null;
  lastModifiedAt: number | null;
  syncStatus: "synced" | "pending" | "error";
}

/**
 * School store actions interface
 * Defines all operations available on the school store
 */
interface SchoolActions {
  // Core CRUD operations
  setSchool: (school: School | null) => void;
  createSchool: (school: InsertSchool) => Promise<void>;
  updateSchool: (updates: Partial<InsertSchool>) => Promise<void>;
  deleteSchool: () => Promise<void>;

  // State management
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
  setInitialized: (isInitialized: boolean) => void;

  // Optimistic updates
  applyOptimisticUpdate: (updates: Partial<School>) => void;
  rollbackOptimisticUpdate: () => void;
  commitOptimisticUpdate: () => void;

  // Sync operations
  fetchSchool: () => Promise<void>;
  refreshSchool: () => Promise<void>;

  // Utility operations
  reset: () => void;
  hasSchool: () => boolean;
  canCreateSchool: () => boolean;
  getSchoolId: () => string | null;

  // Validation
  validateSchoolData: (data: Partial<InsertSchool>) => {
    isValid: boolean;
    errors: Record<string, string>;
  };
}

type SchoolStore = SchoolState & SchoolActions;

/**
 * Initial state for the school store
 */
const initialState: SchoolState = {
  school: null,
  isLoading: false,
  isInitialized: false,
  error: null,
  operationInProgress: {
    type: null,
    startedAt: null,
  },
  optimisticUpdate: {
    previousSchool: null,
    isActive: false,
  },
  lastFetchedAt: null,
  lastModifiedAt: null,
  syncStatus: "synced",
};

/**
 * School validation schema
 */
const validateSchoolData = (data: Partial<InsertSchool>) => {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length === 0) {
    errors.name = "School name is required";
  } else if (data.name.trim().length < 3) {
    errors.name = "School name must be at least 3 characters";
  } else if (data.name.trim().length > 200) {
    errors.name = "School name must not exceed 200 characters";
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Invalid email format";
  }

  if (data.website && !/^https?:\/\/.+/.test(data.website)) {
    errors.website = "Website must be a valid URL";
  }

  if (data.logoUrl && !/^https?:\/\/.+/.test(data.logoUrl)) {
    errors.logoUrl = "Logo URL must be a valid URL";
  }

  if (data.phone && data.phone.length > 20) {
    errors.phone = "Phone number is too long";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Main school store using Zustand with middleware
 * - immer: for immutable state updates
 * - persist: for localStorage persistence
 * - devtools: for Redux DevTools integration
 */
export const useSchoolStore = create<SchoolStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        /**
         * Set the school data directly
         * Used primarily for initial data loading
         */
        setSchool: (school) => {
          set(
            (state) => {
              state.school = school;
              state.lastFetchedAt = Date.now();
              state.syncStatus = "synced";
              state.error = null;
            },
            false,
            "setSchool"
          );
        },

        /**
         * Create a new school (only one allowed per tenant)
         * Implements optimistic updates and error handling
         */
        createSchool: async (schoolData) => {
          const state = get();

          // Prevent multiple schools per tenant
          if (state.school) {
            throw new Error(
              "A school already exists for this account. Only one school per account is allowed."
            );
          }

          // Validate input data
          const validation = validateSchoolData(schoolData);
          if (!validation.isValid) {
            const errorMessage = Object.values(validation.errors).join(", ");
            throw new Error(`Validation failed: ${errorMessage}`);
          }

          // Set operation in progress
          set(
            (state) => {
              state.operationInProgress = {
                type: "create",
                startedAt: Date.now(),
              };
              state.isLoading = true;
              state.error = null;
              state.syncStatus = "pending";
            },
            false,
            "createSchool:start"
          );

          try {
            // Import API function dynamically to avoid circular dependencies
            const { createSchool: apiCreateSchool } = await import(
              "@marka/lib/api"
            );

            // Make API call
            const response = await apiCreateSchool(schoolData);

            // Update state with created school
            set(
              (state) => {
                state.school = response.school;
                state.isLoading = false;
                state.operationInProgress = { type: null, startedAt: null };
                state.lastModifiedAt = Date.now();
                state.lastFetchedAt = Date.now();
                state.syncStatus = "synced";
              },
              false,
              "createSchool:success"
            );

            return response.school;
          } catch (error) {
            // Handle error and rollback
            set(
              (state) => {
                state.error =
                  error instanceof Error
                    ? error
                    : new Error("Failed to create school");
                state.isLoading = false;
                state.operationInProgress = { type: null, startedAt: null };
                state.syncStatus = "error";
              },
              false,
              "createSchool:error"
            );

            throw error;
          }
        },

        /**
         * Update existing school with optimistic updates
         */
        updateSchool: async (updates) => {
          const state = get();

          if (!state.school) {
            throw new Error("No school exists to update");
          }

          // Validate updates
          const validation = validateSchoolData(updates);
          if (!validation.isValid) {
            const errorMessage = Object.values(validation.errors).join(", ");
            throw new Error(`Validation failed: ${errorMessage}`);
          }

          // Store previous state for rollback
          const previousSchool = { ...state.school };

          // Apply optimistic update
          set(
            (state) => {
              state.optimisticUpdate = {
                previousSchool,
                isActive: true,
              };
              state.school = {
                ...state.school!,
                ...updates,
                updatedAt: new Date().toISOString(),
              };
              state.operationInProgress = {
                type: "update",
                startedAt: Date.now(),
              };
              state.isLoading = true;
              state.syncStatus = "pending";
            },
            false,
            "updateSchool:optimistic"
          );

          try {
            const { updateSchool: apiUpdateSchool } = await import(
              "@marka/lib/api"
            );

            const response = await apiUpdateSchool(state.school!.id, updates);

            // Commit optimistic update
            set(
              (state) => {
                state.school = response.school;
                state.optimisticUpdate = {
                  previousSchool: null,
                  isActive: false,
                };
                state.isLoading = false;
                state.operationInProgress = { type: null, startedAt: null };
                state.lastModifiedAt = Date.now();
                state.syncStatus = "synced";
                state.error = null;
              },
              false,
              "updateSchool:success"
            );

            return response.school;
          } catch (error) {
            // Rollback optimistic update
            set(
              (state) => {
                state.school = previousSchool;
                state.optimisticUpdate = {
                  previousSchool: null,
                  isActive: false,
                };
                state.error =
                  error instanceof Error
                    ? error
                    : new Error("Failed to update school");
                state.isLoading = false;
                state.operationInProgress = { type: null, startedAt: null };
                state.syncStatus = "error";
              },
              false,
              "updateSchool:error"
            );

            throw error;
          }
        },

        /**
         * Delete the school (soft delete or hard delete based on backend)
         */
        deleteSchool: async () => {
          const state = get();

          if (!state.school) {
            throw new Error("No school exists to delete");
          }

          const previousSchool = { ...state.school };

          set(
            (state) => {
              state.operationInProgress = {
                type: "delete",
                startedAt: Date.now(),
              };
              state.isLoading = true;
              state.syncStatus = "pending";
            },
            false,
            "deleteSchool:start"
          );

          try {
            const { deleteSchool: apiDeleteSchool } = await import(
              "@marka/lib/api"
            );

            await apiDeleteSchool(state.school.id);

            // Clear school from state
            set(
              (state) => {
                state.school = null;
                state.isLoading = false;
                state.operationInProgress = { type: null, startedAt: null };
                state.lastModifiedAt = Date.now();
                state.syncStatus = "synced";
                state.error = null;
              },
              false,
              "deleteSchool:success"
            );
          } catch (error) {
            // Restore school on error
            set(
              (state) => {
                state.school = previousSchool;
                state.error =
                  error instanceof Error
                    ? error
                    : new Error("Failed to delete school");
                state.isLoading = false;
                state.operationInProgress = { type: null, startedAt: null };
                state.syncStatus = "error";
              },
              false,
              "deleteSchool:error"
            );

            throw error;
          }
        },

        /**
         * Fetch school data from API
         */
        fetchSchool: async () => {
          set(
            (state) => {
              state.isLoading = true;
              state.error = null;
            },
            false,
            "fetchSchool:start"
          );

          try {
            const { getSchools } = await import("@marka/lib/api");

            const response = await getSchools();

            // Tenant should only have one school
            const school = response.schools?.[0] || null;

            set(
              (state) => {
                state.school = school;
                state.isLoading = false;
                state.isInitialized = true;
                state.lastFetchedAt = Date.now();
                state.syncStatus = "synced";
              },
              false,
              "fetchSchool:success"
            );
          } catch (error) {
            set(
              (state) => {
                state.error =
                  error instanceof Error
                    ? error
                    : new Error("Failed to fetch school");
                state.isLoading = false;
                state.isInitialized = true;
                state.syncStatus = "error";
              },
              false,
              "fetchSchool:error"
            );

            throw error;
          }
        },

        /**
         * Force refresh school data
         */
        refreshSchool: async () => {
          await get().fetchSchool();
        },

        /**
         * Apply optimistic update manually
         */
        applyOptimisticUpdate: (updates) => {
          set(
            (state) => {
              if (!state.school) return;

              state.optimisticUpdate = {
                previousSchool: { ...state.school },
                isActive: true,
              };
              state.school = {
                ...state.school,
                ...updates,
              };
            },
            false,
            "applyOptimisticUpdate"
          );
        },

        /**
         * Rollback optimistic update
         */
        rollbackOptimisticUpdate: () => {
          set(
            (state) => {
              if (state.optimisticUpdate.previousSchool) {
                state.school = state.optimisticUpdate.previousSchool;
              }
              state.optimisticUpdate = {
                previousSchool: null,
                isActive: false,
              };
            },
            false,
            "rollbackOptimisticUpdate"
          );
        },

        /**
         * Commit optimistic update
         */
        commitOptimisticUpdate: () => {
          set(
            (state) => {
              state.optimisticUpdate = {
                previousSchool: null,
                isActive: false,
              };
            },
            false,
            "commitOptimisticUpdate"
          );
        },

        /**
         * Set loading state
         */
        setLoading: (isLoading) => {
          set(
            (state) => {
              state.isLoading = isLoading;
            },
            false,
            "setLoading"
          );
        },

        /**
         * Set error state
         */
        setError: (error) => {
          set(
            (state) => {
              state.error = error;
              if (error) {
                state.syncStatus = "error";
              }
            },
            false,
            "setError"
          );
        },

        /**
         * Set initialized state
         */
        setInitialized: (isInitialized) => {
          set(
            (state) => {
              state.isInitialized = isInitialized;
            },
            false,
            "setInitialized"
          );
        },

        /**
         * Reset store to initial state
         */
        reset: () => {
          set(initialState, false, "reset");
        },

        /**
         * Check if school exists
         */
        hasSchool: () => {
          return get().school !== null;
        },

        /**
         * Check if new school can be created
         */
        canCreateSchool: () => {
          return get().school === null;
        },

        /**
         * Get school ID
         */
        getSchoolId: () => {
          return get().school?.id || null;
        },

        /**
         * Validate school data
         */
        validateSchoolData,
      })),
      {
        name: "school-store",
        partialize: (state) => ({
          school: state.school,
          lastFetchedAt: state.lastFetchedAt,
          lastModifiedAt: state.lastModifiedAt,
        }),
      }
    ),
    {
      name: "SchoolStore",
      enabled: process.env.NODE_ENV === "development",
    }
  )
);

/**
 * Selectors for optimized component rendering
 */
export const schoolSelectors = {
  school: (state: SchoolStore) => state.school,
  isLoading: (state: SchoolStore) => state.isLoading,
  error: (state: SchoolStore) => state.error,
  hasSchool: (state: SchoolStore) => state.hasSchool(),
  canCreateSchool: (state: SchoolStore) => state.canCreateSchool(),
  syncStatus: (state: SchoolStore) => state.syncStatus,
  isOperationInProgress: (state: SchoolStore) =>
    state.operationInProgress.type !== null,
};

/**
 * Hook for easy selector usage
 */
export const useSchool = () => useSchoolStore(schoolSelectors.school);
export const useSchoolLoading = () => useSchoolStore(schoolSelectors.isLoading);
export const useSchoolError = () => useSchoolStore(schoolSelectors.error);
export const useHasSchool = () => useSchoolStore(schoolSelectors.hasSchool);
export const useCanCreateSchool = () =>
  useSchoolStore(schoolSelectors.canCreateSchool);
