import PostCard from "@/components/post/PostCard";
import type { LikeType } from "@/types/like.types";
import type { Post } from "@/types/post.types";
import { useQuery } from "@tanstack/react-query";
import { getPost } from "@/services/postsService";
import { postKeys } from "@/lib/queryKeys";

interface PostCardWithLikesProps {
  initialPost: Post;
  onLike: (postId: string, type: LikeType) => void;
  onEdit: (post: Post) => void;
  onDelete: () => void;
  currentUserId?: string;
}

export const PostCardWithLikes = ({
  initialPost,
  onLike,
  onEdit,
  onDelete,
  currentUserId,
}: PostCardWithLikesProps) => {
  const { data: post } = useQuery<Post>({
    queryKey: postKeys.single(initialPost.id),
    queryFn: () => getPost(initialPost.id),
    initialData: initialPost,
    staleTime: 1000 * 60 * 5,
  });

  if (!post) {
    return null;
  }

  return (
    <PostCard
      post={post}
      onLike={onLike}
      onEdit={onEdit}
      onDelete={onDelete}
      userLike={post.userLike}
      currentUserId={currentUserId}
    />
  );
};
