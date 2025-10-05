import { create } from "zustand";
import type { School, InsertSchool } from "@marka/types/api";
import {
  getSchools,
  createSchool,
  updateSchool,
  deleteSchool,
} from "@marka/lib/api";

interface SchoolState {
  school: School | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchSchool: () => Promise<void>;
  createSchoolAction: (data: InsertSchool) => Promise<void>;
  updateSchoolAction: (data: Partial<InsertSchool>) => Promise<void>;
  deleteSchoolAction: () => Promise<void>;
  setSchool: (school: School | null) => void;
  clearError: () => void;
}

export const useSchoolStore = create<SchoolState>((set, get) => ({
  school: null,
  isLoading: false,
  error: null,

  fetchSchool: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getSchools();
      // Only one school per tenant
      const school = response.schools?.[0] || null;
      set({ school, isLoading: false });
    } catch (error: any) {
      console.error("Failed to fetch school:", error);
      set({
        error: error.message || "Failed to fetch school",
        isLoading: false,
      });
      throw error;
    }
  },

  createSchoolAction: async (data) => {
    const { school } = get();

    // Prevent creating multiple schools
    if (school) {
      const error =
        "A school already exists. Only one school per account is allowed.";
      set({ error });
      throw new Error(error);
    }

    set({ isLoading: true, error: null });
    try {
      const response = await createSchool(data);
      set({
        school: response.school,
        isLoading: false,
      });
    } catch (error: any) {
      console.error("Failed to create school:", error);
      set({
        error: error.message || "Failed to create school",
        isLoading: false,
      });
      throw error;
    }
  },

  updateSchoolAction: async (data) => {
    const { school } = get();

    if (!school) {
      const error = "No school exists to update";
      set({ error });
      throw new Error(error);
    }

    set({ isLoading: true, error: null });
    try {
      const response = await updateSchool(school.id, data);
      set({
        school: response.school,
        isLoading: false,
      });
    } catch (error: any) {
      console.error("Failed to update school:", error);
      set({
        error: error.message || "Failed to update school",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteSchoolAction: async () => {
    const { school } = get();

    if (!school) {
      const error = "No school exists to delete";
      set({ error });
      throw new Error(error);
    }

    set({ isLoading: true, error: null });
    try {
      await deleteSchool(school.id);
      set({
        school: null,
        isLoading: false,
      });
    } catch (error: any) {
      console.error("Failed to delete school:", error);
      set({
        error: error.message || "Failed to delete school",
        isLoading: false,
      });
      throw error;
    }
  },

  setSchool: (school) => {
    set({ school });
  },

  clearError: () => {
    set({ error: null });
  },
}));
