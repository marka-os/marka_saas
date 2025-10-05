import { create } from "zustand";
import type { Student, InsertStudent } from "@marka/types/api";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentByLin,
} from "@marka/lib/api";

interface StudentState {
  students: Student[];
  isLoading: boolean;
  error: string | null;
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
  setError: (error: string | null) => void;
  clearError: () => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

export const useStudentStore = create<StudentState>((set) => ({
  students: [],
  isLoading: false,
  error: null,
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

      // Handle different response structures
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

      // Handle different response structures
      const newStudent = response.student || response.data || response;

      // Add to local state
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

      // Handle different response structures
      const updatedStudent = response.student || response.data || response;

      // Update local state
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

      // Remove from local state
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
