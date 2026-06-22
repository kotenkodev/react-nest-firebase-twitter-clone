import type { Comment } from "@/types/comment.types";
import type { Like } from "@/types/like.types";
import type { Post } from "@/types/post.types";
import type { User } from "@/types/user.types";

const parseDate = (value: unknown): Date | undefined => {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  if (typeof value === "object" && value !== null && "_seconds" in value) {
    const secObj = value as { _seconds: number };
    return new Date(secObj._seconds * 1000);
  }
  if (typeof value === "string") {
    return new Date(value);
  }
  return undefined;
};

export const transformUserPayload = (
  rawData: Record<string, unknown>,
): User => {
  return {
    ...rawData,
    birthDate: parseDate(rawData["birthDate"]),
    createdAt: parseDate(rawData["createdAt"]),
  } as unknown as User;
};

export const transformPostPayload = (
  rawData: Record<string, unknown>,
): Post => {
  return {
    ...rawData,
    createdAt: parseDate(rawData["createdAt"]) || new Date(),
    updatedAt: parseDate(rawData["updatedAt"]) || new Date(),
  } as unknown as Post;
};

export const transformLikePayload = (
  rawData: Record<string, unknown>,
): Like => {
  return {
    ...rawData,
    createdAt: parseDate(rawData["createdAt"]) || new Date(),
  } as unknown as Like;
};

export const transformCommentPayload = (
  rawData: Record<string, unknown>,
): Comment => {
  return {
    ...rawData,
    createdAt: parseDate(rawData["createdAt"]) || new Date(),
    updatedAt: parseDate(rawData["updatedAt"]) || new Date(),
  } as unknown as Comment;
};
