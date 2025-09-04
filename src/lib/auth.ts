export function getAuthToken(): string | null {
  return localStorage.getItem("accessToken");
}

export function setAuthToken(token: string): void {
  localStorage.setItem("accessToken", token);
}

export function removeAuthToken(): void {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

export function getStoredUser() {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
}
