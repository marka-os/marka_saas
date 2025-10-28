export class TokenService {
  private static readonly ACCESS_TOKEN_KEY = "accessToken";
  private static readonly REFRESH_TOKEN_KEY = "refreshToken";
  private static readonly USER_KEY = "user";

  /**
   * Get the stored access token.
   * @returns the access token, or null if window is undefined or an error occurs
   */
  static getAuthToken(): string | null {
    try {
      if (typeof window === "undefined") return null;
      return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error("Failed to get auth token: ", error);
      return null;
    }
  }

  /**
   * Set the stored access token.
   * @param token the access token to set
   * @returns true if the token was set successfully, false if window is undefined or an error occurs
   */
  static setAuthToken(token: string): boolean {
    try {
      if (typeof window === "undefined") return false;
      localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
      return true;
    } catch (error) {
      console.error("Failed to set auth token: ", error);
      return false;
    }
  }

  /**
   * Remove the stored access token, refresh token, and user.
   * Does nothing if window is undefined.
   * Logs an error if an error occurs.
   */
  static removeAuthToken(): void {
    try {
      if (typeof window === "undefined") return;
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    } catch (error) {
      console.error("Failed to remove auth token: ", error);
    }
  }

  /**
   * Checks if a given access token is expired.
   * @param token the access token to check
   * @returns true if the token is expired, false otherwise
   */
  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  /**
   * Get the stored user data.
   * If window is undefined, returns null.
   * If an error occurs while parsing the stored user data, logs an error and removes the stored user data.
   * @returns The stored user data, or null if no user is stored.
   */
  static getStoredUser<T>(): T | null {
    try {
      if (typeof window === "undefined") return null;
      const userStr = localStorage.getItem(this.USER_KEY);
      return userStr ? (JSON.parse(userStr) as T) : null;
    } catch (error) {
      console.error("Failed to get stored user: ", error);
      this.removeAuthToken();
      return null;
    }
  }

  /**
   * Set the stored user data.
   * If window is undefined, returns false.
   * If an error occurs while storing the user data, logs an error and returns false.
   * @param user the user data to set
   * @returns true if the user data was set successfully, false otherwise
   */
  static setStoredUser(user: unknown): boolean {
    try {
      if (typeof window === "undefined") return false;
      localStorage.setItem(TokenService.USER_KEY, JSON.stringify(user));
      return true;
    } catch (error) {
      console.error("Failed to set stored user: ", error);
      return false;
    }
  }
}
