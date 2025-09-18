import { create, StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TokenService } from "@marka/lib/auth/token-service";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: "super_admin" | "admin" | "teacher" | "parent";
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isHydrated: boolean; // Added hydration tracking

  verificationUserId: string | null;
  verificationEmail: string | null;
  verificationPhone: string | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;

  login: (token: string, user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => void;
  updateUser: (updates: Partial<User>) => void;
  setHydrated: (hydrated: boolean) => void;

  // Verification methods
  setVerificationData: (userId: string, email: string, phone: string) => void;
  setEmailVerified: (status: boolean) => void;
  setPhoneVerified: (status: boolean) => void;
  clearVerificationData: () => void;
  updateVerificationStatus: (
    emailVerified: boolean,
    phoneVerified: boolean
  ) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    ((set, get) => ({
      user: null,
      token: null,
      isLoading: false, // Don't start with loading true
      isAuthenticated: false,
      isHydrated: false,

      // Verification state
      verificationUserId: null,
      verificationEmail: null,
      verificationPhone: null,
      isEmailVerified: false,
      isPhoneVerified: false,

      login: (token: string, user: User) => {
        // Set token in service first
        TokenService.setAuthToken(token);
        TokenService.setStoredUser(user);

        set({
          user,
          token,
          isLoading: false,
          isAuthenticated: true,
        });
      },

      logout: () => {
        TokenService.removeAuthToken();
        set({
          user: null,
          token: null,
          isLoading: false,
          isAuthenticated: false,
          // Clear verification data on logout
          verificationUserId: null,
          verificationEmail: null,
          verificationPhone: null,
          isEmailVerified: false,
          isPhoneVerified: false,
        });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setHydrated: (hydrated: boolean) => {
        set({ isHydrated: hydrated });
      },

      initializeAuth: () => {
        const token = TokenService.getAuthToken();
        const user = TokenService.getStoredUser<User>();

        // Check if token exists and is not expired
        const isValidToken = token && !TokenService.isTokenExpired(token);
        const isAuthenticated = !!(isValidToken && user);

        console.log("Auth initialization:", {
          hasToken: !!token,
          hasUser: !!user,
          isValidToken,
          isAuthenticated,
        });

        set({
          user,
          token,
          isAuthenticated,
          isLoading: false,
        });
      },

      // FIXED: Add comparison to prevent unnecessary updates
      updateUser: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          const updatedUser = { ...user, ...updates };
          
          // FIXED: Only update if the user data has actually changed
          const hasChanged = JSON.stringify(user) !== JSON.stringify(updatedUser);
          
          if (hasChanged) {
            TokenService.setStoredUser(updatedUser);
            set({ user: updatedUser });
          }
        }
      },

      // Verification methods - FIXED: Add comparison checks
      setVerificationData: (userId: string, email: string, phone: string) => {
        const current = get();
        
        // Only update if values have changed
        if (
          current.verificationUserId !== userId ||
          current.verificationEmail !== email ||
          current.verificationPhone !== phone
        ) {
          set({
            verificationUserId: userId,
            verificationEmail: email,
            verificationPhone: phone,
            isEmailVerified: false,
            isPhoneVerified: false,
          });
        }
      },

      setEmailVerified: (status: boolean) => {
        const current = get();
        
        // Only update if status has changed
        if (current.isEmailVerified !== status) {
          set({ isEmailVerified: status });

          // Also update user if logged in
          const { user } = current;
          if (user && status) {
            const updatedUser = { ...user, isEmailVerified: status };
            TokenService.setStoredUser(updatedUser);
            set({ user: updatedUser });
          }
        }
      },

      setPhoneVerified: (status: boolean) => {
        const current = get();
        
        // Only update if status has changed
        if (current.isPhoneVerified !== status) {
          set({ isPhoneVerified: status });

          // Also update user if logged in
          const { user } = current;
          if (user && status) {
            const updatedUser = { ...user, isPhoneVerified: status };
            TokenService.setStoredUser(updatedUser);
            set({ user: updatedUser });
          }
        }
      },

      clearVerificationData: () => {
        set({
          verificationUserId: null,
          verificationEmail: null,
          verificationPhone: null,
          isEmailVerified: false,
          isPhoneVerified: false,
        });
      },

      updateVerificationStatus: (
        emailVerified: boolean,
        phoneVerified: boolean
      ) => {
        const current = get();
        
        // Only update if status has changed
        if (
          current.isEmailVerified !== emailVerified ||
          current.isPhoneVerified !== phoneVerified
        ) {
          set({
            isEmailVerified: emailVerified,
            isPhoneVerified: phoneVerified,
          });

          // Also update user if logged in
          const { user } = current;
          if (user) {
            const updatedUser = {
              ...user,
              isEmailVerified: emailVerified,
              isPhoneVerified: phoneVerified,
            };
            TokenService.setStoredUser(updatedUser);
            set({ user: updatedUser });
          }
        }
      },
    })) as StateCreator<AuthState>,
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        // Also persist verification state
        verificationUserId: state.verificationUserId,
        verificationEmail: state.verificationEmail,
        verificationPhone: state.verificationPhone,
        isEmailVerified: state.isEmailVerified,
        isPhoneVerified: state.isPhoneVerified,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
          // FIXED: Add a small delay to prevent immediate initialization conflicts
          setTimeout(() => {
            state.initializeAuth();
          }, 0);
        }
      },
    }
  )
);

// Don't initialize immediately - let hydration handle it
// useAuthStore.getState().initializeAuth();