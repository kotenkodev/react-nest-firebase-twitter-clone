import type { CreateLike, Like } from "@/types/like";
import apiClient from "./apiClient";
import { transformLikePayload } from "@/utils/transformPayload";

export const likePost = async (
  postId: string,
  data: CreateLike,
): Promise<Like> => {
  try {
    console.log("Creating like with data:", data);
    const response = await apiClient.post(`posts/${postId}/likes`, data);
    return transformLikePayload(response.data);
  } catch (error) {
    console.error("Error creating like:", error);
    throw error;
  }
};
