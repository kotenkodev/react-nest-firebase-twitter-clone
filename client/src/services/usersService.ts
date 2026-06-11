import type { UpdateUser, User } from "@/types/user";
import apiClient from "./apiClient";

const parseDate = (value: any): Date | undefined => {
  if (!value) return undefined;
  // If it's already a Date object
  if (value instanceof Date) return value;
  // If it's a Firestore Timestamp object from old implementation
  if (typeof value === "object" && "_seconds" in value) {
    return new Date(value._seconds * 1000);
  }
  // If it's a string (ISO)
  if (typeof value === "string") {
    return new Date(value);
  }
  return undefined;
};

const transformUserPayload = (rawData: any): User => {
  return {
    ...rawData,
    birthDate: parseDate(rawData.birthDate),
    createdAt: parseDate(rawData.createdAt),
  };
};

export const getUser = async (id?: string) => {
  try {
    const response = await apiClient.get(`users/${id || "me"}`);

    const cleanUser = transformUserPayload(response.data);

    return cleanUser;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const updateUser = async (id: string, data: UpdateUser) => {
  try {
    const response = await apiClient.put(`users/${id}`, data);
    const cleanUser = transformUserPayload(response.data);
    return cleanUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await apiClient.delete(`users/${id}`);
    const cleanUser = transformUserPayload(response.data);
    return cleanUser;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
