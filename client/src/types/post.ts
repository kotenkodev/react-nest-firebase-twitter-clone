export interface Post {
  id: string;
  title: string;
  content: string;
  photoURL?: string;
  authorId: string;
  commentsCount: number;
  dislikesCount: number;
  likesCount: number;
  createdAt: Date;
}
