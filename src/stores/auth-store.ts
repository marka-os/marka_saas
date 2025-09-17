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
      isLoading: false,
      isAuthenticated: false,

      // Verification state
      verificationUserId: null,
      verificationEmail: null,
      verificationPhone: null,
      isEmailVerified: false,
      isPhoneVerified: false,

      login: (token: string, user: User) => {
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
        });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      initializeAuth: () => {
        const token = TokenService.getAuthToken();
        const user = TokenService.getStoredUser<User>();
        const isAuthenticated = !!token && !TokenService.isTokenExpired(token);

        set({
          user,
          token,
          isAuthenticated,
          isLoading: false,
        });
      },

      updateUser: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          const updatedUser = { ...user, ...updates };
          TokenService.setStoredUser(updatedUser);
          set({ user: updatedUser });
        }
      },
      // Verification methods
      setVerificationData: (userId: string, email: string, phone: string) => {
        set({
          verificationUserId: userId,
          verificationEmail: email,
          verificationPhone: phone,
          isEmailVerified: false,
          isPhoneVerified: false,
        });
      },

      setEmailVerified: (status: boolean) => {
        set({ isEmailVerified: status });

        // Also update user if logged in
        const { user } = get();
        if (user && status) {
          const updatedUser = { ...user, isEmailVerified: status };
          TokenService.setStoredUser(updatedUser);
          set({ user: updatedUser });
        }
      },

      setPhoneVerified: (status: boolean) => {
        set({ isPhoneVerified: status });

        // Also update user if logged in
        const { user } = get();
        if (user && status) {
          const updatedUser = { ...user, isPhoneVerified: status };
          TokenService.setStoredUser(updatedUser);
          set({ user: updatedUser });
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
        set({
          isEmailVerified: emailVerified,
          isPhoneVerified: phoneVerified,
        });

        // Also update user if logged in
        const { user } = get();
        if (user) {
          const updatedUser = {
            ...user,
            isEmailVerified: emailVerified,
            isPhoneVerified: phoneVerified,
          };
          TokenService.setStoredUser(updatedUser);
          set({ user: updatedUser });
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
        state?.initializeAuth();
      },
    }
  )
);

//Initialize auth on store creation
useAuthStore.getState().initializeAuth();
