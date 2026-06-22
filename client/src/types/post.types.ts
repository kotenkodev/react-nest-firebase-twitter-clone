import type { LikeType } from "./like.types";

export interface Post {
  id: string;
  title: string;
  content: string;
  photoURL?: string;
  authorId: string;
  author?: {
    firstName: string;
    lastName: string;
    photoURL: string;
  };
  commentsCount: number;
  dislikesCount: number;
  likesCount: number;
  createdAt: Date;
  updatedAt: Date;
  userLike?: LikeType | null;
}

export type CreatePost = {
  id: string;
  title?: string;
  content?: string;
  photoURL?: string;
};

export type UpdatePost = Partial<Pick<Post, "title" | "content" | "photoURL">>;

export type PostSortBy = "newest" | "popular";
