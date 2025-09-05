import { apiRequest } from "./queryClient";
import {
  LoginDto,
  RegisterDto,
  InsertSchool,
  InsertStudent,
  InsertAssessment,
  UpdateAssessment,
  // UpdateStudent,
  //UpdateSchool,
} from "@marka/types/api";

/**
 * Logs in a user with the provided credentials.
 *
 * @param credentials The user credentials.
 * @returns The user data.
 */
export async function login(credentials: LoginDto) {
  const response = await apiRequest("POST", "/api/v1/auth/login", credentials);
  return response.json();
}

/**
 * Registers a user with the provided user data.
 *
 * @param userData The user data.
 * @returns The user data.
 */
export async function register(userData: RegisterDto) {
  const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL?.replace(/\/$/, "");
  console.log("Using API base URL:", BASE_URL);
  const response = await apiRequest("POST", "/api/v1/auth/register", userData);
  return response.json();
}

/**
 * Logs out the user.
 *
 * @returns The logout response.
 */
export async function logout() {
  const response = await apiRequest("POST", "/api/v1/auth/logout");
  return response.json();
}

/**
 * Refreshes an access token given a refresh token.
 *
 * @param token The refresh token.
 * @returns The new access token.
 */
export async function refreshToken(token: string) {
  const response = await apiRequest("POST", "/api/v1/auth/refresh", {
    refreshToken: token,
  });
  return response.json();
}

/**
 * Gets a list of students for a given school.
 *
 * @param schoolId The ID of the school.
 * @returns A list of students.
 */
export async function getStudents(schoolId: string) {
  const response = await apiRequest(
    "GET",
    `/api/v1/students?schoolId=${schoolId}`
  );
  return response.json();
}

/**
 * Creates a student with the given data.
 *
 * @param student The student data.
 * @returns The created student.
 */
export async function createStudent(student: InsertStudent) {
  const response = await apiRequest("POST", "/api/v1/students", student);
  return response.json();
}

//export async function updateStudent(id: string, updates: UpdateStudent) {
//  const response = await apiRequest("PATCH", `/api/v1/students/${id}`, updates);
//return response.json();
//}

export async function deleteStudent(id: string) {
  const response = await apiRequest("DELETE", `/api/v1/students/${id}`);
  return response.json();
}

export async function getStudentByLin(lin: string) {
  const response = await apiRequest("GET", `/api/v1/students/lin/${lin}`);
  return response.json();
}

/**
export async function getTeachers() {
  const response = await apiRequest("GET", "/api/v1/users?role=teacher");
  return response.json();
}

export async function createTeacher(teacher: any) {
  const response = await apiRequest("POST", "/api/v1/users", {
    ...teacher,
    role: "teacher",
  });
  return response.json();
}

export async function updateTeacher(id: string, updates: any) {
  const response = await apiRequest("PATCH", `/api/v1/users/${id}`, updates);
  return response.json();
}

export async function deleteTeacher(id: string) {
  const response = await apiRequest("DELETE", `/api/v1/users/${id}`);
  return response.json();
}
  */

// Schools
export async function getSchools() {
  const response = await apiRequest("GET", "/api/v1/schools");
  return response.json();
}

export async function createSchool(school: InsertSchool) {
  const response = await apiRequest("POST", "/api/v1/schools", school);
  return response.json();
}

export async function updateSchool(id: string, updates: any) {
  const response = await apiRequest("PATCH", `/api/v1/schools/${id}`, updates);
  return response.json();
}

export async function deleteSchool(id: string) {
  const response = await apiRequest("DELETE", `/api/v1/schools/${id}`);
  return response.json();
}

// Subjects
export async function getSubjects(examLevel: string) {
  const response = await apiRequest(
    "GET",
    `/api/v1/subjects?examLevel=${examLevel}`
  );
  return response.json();
}

//export async function createSubject(subject: any) {
//  const response = await apiRequest("POST", "/api/v1/subjects", subject);
//  return response.json();
//}

//export async function updateSubject(id: string, updates: any) {
//const response = await apiRequest("PATCH", `/api/v1/subjects/${id}`, updates);
//  return response.json();
//}

export async function deleteSubject(id: string) {
  const response = await apiRequest("DELETE", `/api/v1/subjects/${id}`);
  return response.json();
}

// Assessments
export async function getAssessments(
  studentId: string,
  examLevel?: string,
  subjectId?: string
) {
  let url = `/api/v1/assessments?studentId=${studentId}`;
  if (examLevel) url += `&examLevel=${examLevel}`;
  if (subjectId) url += `&subjectId=${subjectId}`;

  const response = await apiRequest("GET", url);
  return response.json();
}

export async function createAssessment(assessment: InsertAssessment) {
  const response = await apiRequest("POST", "/api/v1/assessments", assessment);
  return response.json();
}

export async function updateAssessment(id: string, updates: UpdateAssessment) {
  const response = await apiRequest(
    "PUT",
    `/api/v1/assessments/${id}`,
    updates
  );
  return response.json();
}

export async function deleteAssessment(id: string) {
  const response = await apiRequest("DELETE", `/api/v1/assessments/${id}`);
  return response.json();
}

// Grading
export async function calculateGrade(score: number, examLevel: string) {
  const response = await apiRequest(
    "GET",
    `/api/v1/grading/calculate?score=${score}&examLevel=${examLevel}`
  );
  return response.json();
}
