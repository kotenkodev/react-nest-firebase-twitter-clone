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
  replyingCommentId: string | null;
  setReplyingCommentId: (commentId: string | null) => void;
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
      replyingCommentId: comment ? null : state.replyingCommentId,
    })),
  replyingCommentId: null,
  setReplyingCommentId: (commentId) =>
    set((state) => ({
      replyingCommentId: commentId,
      editingComment: commentId ? null : state.editingComment,
    })),
  clearCommentState: () =>
    set({
      editingComment: null,
      replyingCommentId: null,
    }),
}));
