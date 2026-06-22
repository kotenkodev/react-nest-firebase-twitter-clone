export interface Comment {
  id: string;
  postId: string;
  content: string;
  parentId?: string | null;
  replyCount: number;
  authorId: string;
  author: {
    firstName: string;
    lastName?: string;
    photoURL?: string;
    emailVerified?: boolean;
  };
  isDeleted?: boolean;
  isEdited?: boolean;
  createdAt: Date;
  updatedAt?: Date;
}
