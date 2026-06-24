import type { CreateLike, Like } from "@/types/like.types";
import apiClient from "./apiClient";
import { transformLikePayload } from "@/utils/transformPayload";

export const likePost = async (
  postId: string,
  data: CreateLike,
): Promise<Like> => {
  try {
    const response = await apiClient.post(`posts/${postId}/likes`, data);
    return transformLikePayload(response.data);
  } catch (error) {
    console.error("Error creating like:", error);
    throw error;
  }
};

export const getLikesByPostIds = async (postIds: string[]): Promise<Like[]> => {
  try {
    const response = await apiClient.get(`posts/batch/likes`, {
      params: { postIds: postIds.join(",") },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching likes:", error);
    throw error;
  }
};
