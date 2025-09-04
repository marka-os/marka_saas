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

  login: (token: string, user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => void;
  updateUser: (updates: Partial<User>) => void;
}


export const useAuthStore = create<AuthState>()(
  persist(
    ((set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

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
    })) as StateCreator<AuthState>,
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
      onRehydrateStorage: () => (state) => {
        state?.initializeAuth();
      },
    }
  )
);

//Initialize auth on store creation
useAuthStore.getState().initializeAuth();
