export interface Comment {
  id: string;
  content: string;
  authorId: string;
  parentId?: string;
  author: {
    firstName: string;
    lastName?: string;
    photoURL?: string;
  };
  isDeleted: boolean;
  replyCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateComment = Pick<Comment, "id" | "content">;

export type UpdateComment = Pick<Comment, "content">;
