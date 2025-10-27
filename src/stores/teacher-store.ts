import { create } from "zustand";
import type { Teacher, InsertTeacher, UpdateTeacher } from "@marka/types/api";
import {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getTeacherByEmployeeId,
  downloadTeacherTemplate,
  importTeachers,
  exportTeachers,
} from "@marka/lib/api";

interface ImportResult {
  total: number;
  successful: number;
  failed: number;
  errors: Array<{
    row: number;
    error: string;
    data: any;
  }>;
}

interface TeacherState {
  teachers: Teacher[];
  currentTeacher: Teacher | null;
  isLoading: boolean;
  error: string | null;
  importResult: ImportResult | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
  };

  // Actions
  fetchTeachers: (page?: number, limit?: number) => Promise<void>;
  fetchTeacherById: (id: string) => Promise<void>;
  createTeacherAction: (data: InsertTeacher) => Promise<void>;
  updateTeacherAction: (
    id: string,
    data: UpdateTeacher
  ) => Promise<void>;
  deleteTeacherAction: (id: string) => Promise<void>;
  searchByEmployeeId: (employeeId: string) => Promise<Teacher | null>;

  // Bulk operations
  downloadTemplate: (format?: "xlsx" | "csv") => Promise<void>;
  importTeachersAction: (file: File) => Promise<ImportResult>;
  exportTeachersAction: (
    format?: "xlsx" | "csv",
    schoolId?: string
  ) => Promise<void>;
  clearImportResult: () => void;

  setError: (error: string | null) => void;
  clearError: () => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

export const useTeacherStore = create<TeacherState>((set, get) => ({
  teachers: [],
  currentTeacher: null,
  isLoading: false,
  error: null,
  importResult: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 20,
  },

  fetchTeachers: async (page = 1, limit = 20) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getTeachers();
      console.log("Fetch teachers response:", response);

      let teachers = [];

      if (Array.isArray(response)) {
        teachers = response;
      } else if (response.teachers && Array.isArray(response.teachers)) {
        teachers = response.teachers;
      } else if (response.data && Array.isArray(response.data)) {
        teachers = response.data;
      }

      console.log("Parsed teachers:", teachers);

      set({
        teachers,
        pagination: {
          currentPage: page,
          totalPages: response.totalPages || Math.ceil(teachers.length / limit),
          totalItems: response.total || teachers.length,
          limit,
        },
        isLoading: false,
      });
    } catch (error: any) {
      console.error("Failed to fetch teachers:", error);
      set({
        error: error.message || "Failed to fetch teachers",
        isLoading: false,
      });
      throw error;
    }
  },

  fetchTeacherById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getTeacherById(id);
      const teacher = response.teacher || response.data || response;

      set({ currentTeacher: teacher, isLoading: false });
    } catch (error: any) {
      console.error("Failed to fetch teacher:", error);
      set({
        error: error.message || "Failed to fetch teacher",
        isLoading: false,
      });
      throw error;
    }
  },

  createTeacherAction: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await createTeacher(data);
      console.log("Create teacher response:", response);

      const newTeacher = response.teacher || response.data || response;

      set((state) => ({
        teachers: [newTeacher, ...state.teachers],
        pagination: {
          ...state.pagination,
          totalItems: state.pagination.totalItems + 1,
        },
        isLoading: false,
      }));
    } catch (error: any) {
      console.error("Failed to create teacher:", error);
      set({
        error: error.message || "Failed to create teacher",
        isLoading: false,
      });
      throw error;
    }
  },

  updateTeacherAction: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await updateTeacher(id, data);
      console.log("Update teacher response:", response);

      const updatedTeacher = response.teacher || response.data || response;

      set((state) => ({
        teachers: state.teachers.map((teacher) =>
          teacher.id === id ? { ...teacher, ...updatedTeacher } : teacher
        ),
        currentTeacher:
          state.currentTeacher?.id === id
            ? { ...state.currentTeacher, ...updatedTeacher }
            : state.currentTeacher,
        isLoading: false,
      }));
    } catch (error: any) {
      console.error("Failed to update teacher:", error);
      set({
        error: error.message || "Failed to update teacher",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteTeacherAction: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteTeacher(id);

      set((state) => ({
        teachers: state.teachers.filter((teacher) => teacher.id !== id),
        currentTeacher:
          state.currentTeacher?.id === id ? null : state.currentTeacher,
        pagination: {
          ...state.pagination,
          totalItems: state.pagination.totalItems - 1,
        },
        isLoading: false,
      }));
    } catch (error: any) {
      console.error("Failed to delete teacher:", error);
      set({
        error: error.message || "Failed to delete teacher",
        isLoading: false,
      });
      throw error;
    }
  },

  searchByEmployeeId: async (employeeId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getTeacherByEmployeeId(employeeId);
      console.log("Search by employee ID response:", response);

      const teacher = response.teacher || response.data || response;

      set({ isLoading: false });
      return teacher;
    } catch (error: any) {
      console.error("Failed to search teacher by employee ID:", error);
      set({
        error: error.message || "Failed to search teacher",
        isLoading: false,
      });
      throw error;
    }
  },

  downloadTemplate: async (format = "xlsx") => {
    set({ isLoading: true, error: null });
    try {
      await downloadTeacherTemplate(format);
      set({ isLoading: false });
    } catch (error: any) {
      console.error("Failed to download template:", error);
      set({
        error: error.message || "Failed to download template",
        isLoading: false,
      });
      throw error;
    }
  },

  importTeachersAction: async (file: File) => {
    set({ isLoading: true, error: null, importResult: null });
    try {
      const result = await importTeachers(file);
      console.log("Import result:", result);

      set({ importResult: result, isLoading: false });

      // Refresh teachers list after import
      const state = get();
      const schoolId = state.teachers[0]?.schoolId;
      if (schoolId) {
        await get().fetchTeachers();
      }

      return result;
    } catch (error: any) {
      console.error("Failed to import teachers:", error);
      set({
        error: error.message || "Failed to import teachers",
        isLoading: false,
      });
      throw error;
    }
  },

  exportTeachersAction: async (format = "xlsx", schoolId?: string) => {
    set({ isLoading: true, error: null });
    try {
      await exportTeachers(format, schoolId);
      set({ isLoading: false });
    } catch (error: any) {
      console.error("Failed to export teachers:", error);
      set({
        error: error.message || "Failed to export teachers",
        isLoading: false,
      });
      throw error;
    }
  },

  clearImportResult: () => {
    set({ importResult: null });
  },

  setError: (error) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  setPage: (page) => {
    set((state) => ({
      pagination: { ...state.pagination, currentPage: page },
    }));
  },

  setLimit: (limit) => {
    set((state) => ({
      pagination: { ...state.pagination, limit },
    }));
  },
}));
