import { create } from "zustand";
import type { Student, InsertStudent } from "@marka/types/api";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentByLin,
  downloadStudentTemplate,
  importStudents,
  exportStudents,
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

interface StudentState {
  students: Student[];
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
  fetchStudents: (
    schoolId: string,
    page?: number,
    limit?: number
  ) => Promise<void>;
  createStudentAction: (data: InsertStudent) => Promise<void>;
  updateStudentAction: (
    id: string,
    data: Partial<InsertStudent>
  ) => Promise<void>;
  deleteStudentAction: (id: string) => Promise<void>;
  searchByLin: (lin: string) => Promise<Student | null>;

  // Bulk operations
  downloadTemplate: (format?: "xlsx" | "csv") => Promise<void>;
  importStudentsAction: (file: File) => Promise<ImportResult>;
  exportStudentsAction: (
    format?: "xlsx" | "csv",
    schoolId?: string
  ) => Promise<void>;
  clearImportResult: () => void;

  setError: (error: string | null) => void;
  clearError: () => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

export const useStudentStore = create<StudentState>((set, get) => ({
  students: [],
  isLoading: false,
  error: null,
  importResult: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 20,
  },

  fetchStudents: async (schoolId: string, page = 1, limit = 20) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getStudents(schoolId);
      console.log("Fetch students response:", response);

      let students = [];

      if (Array.isArray(response)) {
        students = response;
      } else if (response.students && Array.isArray(response.students)) {
        students = response.students;
      } else if (response.data && Array.isArray(response.data)) {
        students = response.data;
      }

      console.log("Parsed students:", students);

      set({
        students,
        pagination: {
          currentPage: page,
          totalPages: response.totalPages || Math.ceil(students.length / limit),
          totalItems: response.total || students.length,
          limit,
        },
        isLoading: false,
      });
    } catch (error: any) {
      console.error("Failed to fetch students:", error);
      set({
        error: error.message || "Failed to fetch students",
        isLoading: false,
      });
      throw error;
    }
  },

  createStudentAction: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await createStudent(data);
      console.log("Create student response:", response);

      const newStudent = response.student || response.data || response;

      set((state) => ({
        students: [newStudent, ...state.students],
        pagination: {
          ...state.pagination,
          totalItems: state.pagination.totalItems + 1,
        },
        isLoading: false,
      }));
    } catch (error: any) {
      console.error("Failed to create student:", error);
      set({
        error: error.message || "Failed to create student",
        isLoading: false,
      });
      throw error;
    }
  },

  updateStudentAction: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await updateStudent(id, data);
      console.log("Update student response:", response);

      const updatedStudent = response.student || response.data || response;

      set((state) => ({
        students: state.students.map((student) =>
          student.id === id ? { ...student, ...updatedStudent } : student
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      console.error("Failed to update student:", error);
      set({
        error: error.message || "Failed to update student",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteStudentAction: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteStudent(id);

      set((state) => ({
        students: state.students.filter((student) => student.id !== id),
        pagination: {
          ...state.pagination,
          totalItems: state.pagination.totalItems - 1,
        },
        isLoading: false,
      }));
    } catch (error: any) {
      console.error("Failed to delete student:", error);
      set({
        error: error.message || "Failed to delete student",
        isLoading: false,
      });
      throw error;
    }
  },

  searchByLin: async (lin: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getStudentByLin(lin);
      console.log("Search by LIN response:", response);

      const student = response.student || response.data || response;

      set({ isLoading: false });
      return student;
    } catch (error: any) {
      console.error("Failed to search student by LIN:", error);
      set({
        error: error.message || "Failed to search student",
        isLoading: false,
      });
      throw error;
    }
  },

  downloadTemplate: async (format = "xlsx") => {
    set({ isLoading: true, error: null });
    try {
      await downloadStudentTemplate(format);
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

  importStudentsAction: async (file: File) => {
    set({ isLoading: true, error: null, importResult: null });
    try {
      const result = await importStudents(file);
      console.log("Import result:", result);

      set({ importResult: result, isLoading: false });

      // Refresh students list after import
      const state = get();
      const schoolId = state.students[0]?.schoolId;
      if (schoolId) {
        await get().fetchStudents(schoolId);
      }

      return result;
    } catch (error: any) {
      console.error("Failed to import students:", error);
      set({
        error: error.message || "Failed to import students",
        isLoading: false,
      });
      throw error;
    }
  },

  exportStudentsAction: async (format = "xlsx", schoolId?: string) => {
    set({ isLoading: true, error: null });
    try {
      await exportStudents(format, schoolId);
      set({ isLoading: false });
    } catch (error: any) {
      console.error("Failed to export students:", error);
      set({
        error: error.message || "Failed to export students",
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
