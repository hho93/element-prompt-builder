import { create } from "zustand";

/**
 * Interface for the authentication store state and actions
 */
export interface AuthState {
  // State properties
  accessToken: string | null;

  // Actions
  setAccessToken: (token: string | null) => void;
}

/**
 * Zustand store for authentication with persistence
 */
export const useAuthStore = create<AuthState>()((set, get) => ({
  // Initial state
  accessToken: null,

  // Actions to update auth state
  setAccessToken: (token) =>
    set({
      accessToken: token,
    }),
  getAccessToken: () => {
    return get().accessToken;
  },
}));
