import type { User } from "@/types/user";

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
