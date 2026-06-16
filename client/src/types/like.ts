export type LikeType = "like" | "dislike";

export interface Like {
  id: string;
  type: LikeType;
  userId: string;
  postId: string;
  createdAt: Date;
}

export type CreateLike = Pick<Like, "type">;

export type UpdateLike = Pick<Like, "type">;
