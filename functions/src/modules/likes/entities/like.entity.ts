export enum LikeType {
  LIKE = 'like',
  DISLIKE = 'dislike',
}

export interface Like {
  id: string;
  type: LikeType;
  userId: string;
  createdAt: Date;
}
