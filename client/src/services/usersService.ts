import type { UpdateUser } from "@/types/user.types";
import apiClient from "./apiClient";
import { transformUserPayload } from "@/utils/transformPayload";

export const getUser = async (id?: string) => {
  try {
    const response = await apiClient.get(`users/${id || "me"}`);

    return transformUserPayload(response.data);
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const updateUser = async (id: string, data: UpdateUser) => {
  try {
    const response = await apiClient.put(`users/${id}`, data);
    return transformUserPayload(response.data);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
