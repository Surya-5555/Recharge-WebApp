import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("recharge-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("recharge-theme", theme);
    set({ theme });
  },
}));