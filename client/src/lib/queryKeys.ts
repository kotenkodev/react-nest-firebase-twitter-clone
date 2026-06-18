export const postKeys = {
  all: ["posts"] as const,
  feed: () => [...postKeys.all, "feed"] as const,
  userFeed: (userId: string) => [...postKeys.all, "user", userId] as const,
  single: (postId: string) => ["post", postId] as const,
};

export const userKeys = {
  single: (userId: string) => ["user", userId] as const,
};
