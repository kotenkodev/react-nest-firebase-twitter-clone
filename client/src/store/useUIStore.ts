import { create } from "zustand";

interface UIState {
  isPostDialogOpen: boolean;
  setPostDialogOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isPostDialogOpen: false,
  setPostDialogOpen: (isOpen) => set({ isPostDialogOpen: isOpen }),
}));
