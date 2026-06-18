import type { Like } from "@/types/like.types";
import type { Post } from "@/types/post.types";
import type { User } from "@/types/user.types";

const parseDate = (value: any): Date | undefined => {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  if (typeof value === "object" && "_seconds" in value) {
    return new Date(value._seconds * 1000);
  }
  if (typeof value === "string") {
    return new Date(value);
  }
  return undefined;
};

export const transformUserPayload = (rawData: any): User => {
  return {
    ...rawData,
    birthDate: parseDate(rawData.birthDate),
    createdAt: parseDate(rawData.createdAt),
  };
};

export const transformPostPayload = (rawData: any): Post => {
  return {
    ...rawData,
    createdAt: parseDate(rawData.createdAt) || new Date(),
    updatedAt: parseDate(rawData.updatedAt) || new Date(),
  };
};

export const transformLikePayload = (rawData: any): Like => {
  return {
    ...rawData,
    createdAt: parseDate(rawData.createdAt) || new Date(),
  };
};
