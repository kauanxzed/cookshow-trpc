import { create } from "zustand";

interface AuthStoreState {
  email: string;
  password: string;
  setCredentials: (email: string, password: string) => Promise<void>;
}

const useAuthStore = create<AuthStoreState>()((set) => ({
  email: "",
  password: "",
  setCredentials: async (email, password) => {
    return new Promise((resolve) => {
      set({ email, password });
      resolve();
    });
  },
}));

export { useAuthStore };
