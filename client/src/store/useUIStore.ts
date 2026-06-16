import type { Post } from "@/types/post";
import { create } from "zustand";

interface UIState {
  isPostDialogOpen: boolean;
  setPostDialogOpen: (isOpen: boolean) => void;
  editingPost: Post | null;
  setEditingPost: (post: Post | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isPostDialogOpen: false,
  setPostDialogOpen: (isOpen) =>
    set((state) => ({
      isPostDialogOpen: isOpen,
      editingPost: isOpen ? state.editingPost : null,
    })),
  editingPost: null,
  setEditingPost: (post) => set({ editingPost: post }),
}));
