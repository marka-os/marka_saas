// stores/ui-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  theme: "light" | "dark";
  sidebarOpen: boolean;
  modals: {
    login: boolean;
    signup: boolean;
    settings: boolean;
  };

  // Actions
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  openModal: (modal: keyof UIState["modals"]) => void;
  closeModal: (modal: keyof UIState["modals"]) => void;
  closeAllModals: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: "light",
      sidebarOpen: false,
      modals: {
        login: false,
        signup: false,
        settings: false,
      },

      setTheme: (theme) => set({ theme }),

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),

      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

      toggleSidebar: () =>
        set((state) => ({
          sidebarOpen: !state.sidebarOpen,
        })),

      openModal: (modal) =>
        set((state) => ({
          modals: { ...state.modals, [modal]: true },
        })),

      closeModal: (modal) =>
        set((state) => ({
          modals: { ...state.modals, [modal]: false },
        })),

      closeAllModals: () =>
        set({
          modals: { login: false, signup: false, settings: false },
        }),
    }),
    {
      name: "ui-storage",
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
