type UserRole = "super_admin" | "admin" | "teacher" | "parent";
type Plan = "standard" | "pro" | "enterprise" | "custom";
type SchoolLevel = "primary" | "o_level" | "a_level" | "combined";
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  plan: Plan;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  tenantId?: string;
  profileImageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// School types
export interface School {
  id: string;
  tenantId: string;
  name: string;
  code?: string;
  level: SchoolLevel;
  address?: string;
  city?: string;
  district?: string;
  region?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  logoUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InsertSchool {
  name: string;
  code?: string;
  level?: SchoolLevel;
  address?: string;
  city?: string;
  district?: string;
  region?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  logoUrl?: string;
}

// Use Partial<InsertSchool> directly for update operations instead of UpdateSchool interface

export interface Student {
  id: string;
  lin: string;
  firstName: string;
  lastName: string;
  middleName: string;
  gender: "male" | "female" | "other";
  dateOfBirth: string;
  placeOfBirth: string;
  address: string;
  phone: string;
  email: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  class: string;
  stream: string;
  status: string;
  admissionDate: string;
  graduationDate: string;
  photoUrl: string;
  schoolId: string;
}

export interface InsertStudent {
  schoolId: string;
  lin?: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  gender?: "male" | "female" | "other";
  dateOfBirth?: string;
  placeOfBirth?: string;
  nationality?: string;
  religion?: string;
  parentGuardianName?: string;
  parentGuardianPhone?: string;
  parentGuardianEmail?: string;
  address?: string;
  //medicalInfo?: any;
  // emergencyContact?: any;
  currentClass?: string;
  currentStream?: string;
  admissionNumber?: string;
  admissionDate?: string;
}


// Teacher type (User with teacher role)
export interface Teacher extends User {
  role: "teacher";
}

// Subject types
export interface Subject {
  id: string;
  name: string;
  code?: string;
  examLevel: "ple" | "uce" | "uace";
  description?: string;
  isCore: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Assessment types
export interface Assessment {
  id: string;
  AssessmentName: string;
  type: AssessmentType;
  examLevel: ExamLevel;
  caScore: number;
  examScore: number;
  studentId: string;
  subjectId: string;
  remark: string;
  metadata: Metadata;
}

export type AssessmentType =
  | "exam"
  | "test"
  | "quiz"
  | "assignment"
  | "project"
  | "practical";

export type ExamLevel = "ple" | "uce" | "uace";
export type Metadata = Record<string, unknown>;

export interface InsertAssessment {
  AssessmentName: string;
  type: AssessmentType;
  examLevel: ExamLevel;
  caScore: number;
  examScore: number;
  studentId: string;
  subjectId: string;
  remark: string;
  metadata: Metadata;
}

export interface UpdateAssessment extends Partial<InsertAssessment> {
  id: string;
}

// API Response types
export interface ApiResponse<T> {
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
