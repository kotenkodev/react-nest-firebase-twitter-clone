import type { CreateComment, UpdateComment } from "@/types/comment.types";
import apiClient from "./apiClient";

export const getComments = async (
  limit: number,
  postId?: string,
  parentId?: string,
  cursor?: string,
): Promise<Comment[]> => {
  try {
    const response = await apiClient.get(`posts/${postId}/comments`, {
      params: {
        postId,
        parentId,
        lastDocId: cursor,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

export const createComment = async (postId: string, data: CreateComment) => {
  try {
    const response = await apiClient.post(`posts/${postId}/comments`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

export const updateComment = async (
  postId: string,
  commentId: string,
  data: UpdateComment,
) => {
  try {
    const response = await apiClient.put(
      `posts/${postId}/comments/${commentId}`,
      data,
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating comment ${commentId}:`, error);
    throw error;
  }
};

export const deleteComment = async (postId: string, commentId: string) => {
  try {
    await apiClient.delete(`posts/${postId}/comments/${commentId}`);
  } catch (error) {
    console.error(`Error deleting comment ${commentId}:`, error);
    throw error;
  }
};
