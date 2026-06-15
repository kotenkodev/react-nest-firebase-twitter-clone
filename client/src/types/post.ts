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
}
