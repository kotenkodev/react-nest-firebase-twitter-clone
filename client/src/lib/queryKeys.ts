export type PostFilters = {
  search?: string;
  sortBy?: "newest" | "popular";
};

export const postKeys = {
  all: ["posts"] as const,
  feed: (filters?: PostFilters) =>
    [...postKeys.all, "feed", { ...filters }] as const,
  userFeed: (userId: string, filters?: PostFilters) =>
    [...postKeys.all, "user", userId, { ...filters }] as const,
  single: (postId: string) => ["post", postId] as const,
};

export const userKeys = {
  single: (userId: string) => ["user", userId] as const,
};
