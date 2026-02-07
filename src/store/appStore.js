import { create } from "zustand";

// ============================================
// 🏪 Global State Store (Zustand)
// ============================================
// Use this for global app state management
// Much simpler than Redux, perfect for hackathons

const useAppStore = create((set, get) => ({
  // ---- User State ----
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),

  // ---- Loading State ----
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),

  // ---- Theme ----
  theme: "light",
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "light" ? "dark" : "light",
    })),

  // ---- Notifications / Messages ----
  messages: [],
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, { id: Date.now(), ...message }],
    })),
  clearMessages: () => set({ messages: [] }),

  // ---- Generic Data Store ----
  // Use this for any data your hackathon project needs
  data: {},
  setData: (key, value) =>
    set((state) => ({
      data: { ...state.data, [key]: value },
    })),
  getData: (key) => get().data[key],

  // ---- Modal State ----
  modal: { isOpen: false, content: null },
  openModal: (content) => set({ modal: { isOpen: true, content } }),
  closeModal: () => set({ modal: { isOpen: false, content: null } }),
}));

export default useAppStore;
