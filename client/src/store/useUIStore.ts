import type { Comment } from "@/types/comment.types";
import type { Post } from "@/types/post.types";
import { create } from "zustand";

interface UIState {
  isPostDialogOpen: boolean;
  setPostDialogOpen: (isOpen: boolean) => void;
  editingPost: Post | null;
  setEditingPost: (post: Post | null) => void;

  editingComment: Comment | null;
  setEditingComment: (comment: Comment | null) => void;
  replyingComment: Comment | null;
  setReplyingComment: (comment: Comment | null) => void;
  clearCommentState: () => void;
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
  editingComment: null,
  setEditingComment: (comment) =>
    set((state) => ({
      editingComment: comment,
      replyingComment: comment ? null : state.replyingComment,
    })),
  replyingComment: null,
  setReplyingComment: (comment) =>
    set((state) => ({
      replyingComment: comment,
      editingComment: comment ? null : state.editingComment,
    })),
  clearCommentState: () =>
    set({
      editingComment: null,
      replyingComment: null,
    }),
}));
