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
      console.log("Fetch school response:", response);

      // Handle different response structures
      let school = null;

      // Backend returns direct array: [{id: "...", name: "...", ...}]
      if (Array.isArray(response)) {
        school = response[0] || null;
      } else if (response.schools && Array.isArray(response.schools)) {
        school = response.schools[0] || null;
      } else if (response.data && Array.isArray(response.data)) {
        school = response.data[0] || null;
      } else if (response.school) {
        school = response.school;
      }

      console.log("Parsed school:", school);
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
      console.log("Create school response:", response);

      // Handle different response structures
      const newSchool = response.school || response.data || response;

      set({
        school: newSchool,
        isLoading: false,
      });
    } catch (error: any) {
      console.error("Failed to create school:", error);

      // Handle 409 conflict specifically
      if (error.response?.status === 409 || error.statusCode === 409) {
        // School already exists, try to fetch it
        try {
          await get().fetchSchool();
        } catch (fetchError) {
          console.error("Failed to fetch existing school:", fetchError);
        }
      }

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
      console.log("Update school response:", response);

      // Handle different response structures
      const updatedSchool = response.school || response.data || response;

      set({
        school: updatedSchool,
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
