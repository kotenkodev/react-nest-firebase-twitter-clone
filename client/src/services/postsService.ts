import type { CreatePost, Post, UpdatePost } from "@/types/post";
import apiClient from "./apiClient";
import { transformPostPayload } from "@/utils/transformPayload";

export const getPosts = async (): Promise<Post[]> => {
  try {
    const response = await apiClient.get("posts");
    return response.data.map(transformPostPayload);
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const getPost = async (id: string): Promise<Post> => {
  try {
    const response = await apiClient.get(`posts/${id}`);
    return transformPostPayload(response.data);
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    throw error;
  }
};

export const createPost = async (data: CreatePost): Promise<Post> => {
  try {
    console.log("Creating post with data:", data);
    const response = await apiClient.post("posts", data);
    return transformPostPayload(response.data);
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const updatePost = async (
  id: string,
  data: UpdatePost,
): Promise<Post> => {
  try {
    const response = await apiClient.patch(`posts/${id}`, data);
    return transformPostPayload(response.data);
  } catch (error) {
    console.error(`Error updating post ${id}:`, error);
    throw error;
  }
};

export const deletePost = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`posts/${id}`);
  } catch (error) {
    console.error(`Error deleting post ${id}:`, error);
    throw error;
  }
};
