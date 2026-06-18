import { postKeys } from "@/lib/queryKeys";
import { getPost } from "@/services/postsService";
import type { Post } from "@/types/post.types";
import { useQuery } from "@tanstack/react-query";

export const usePost = (postId: string) => {
  const {
    data: post,
    error,
    isPending: isLoading,
  } = useQuery<Post>({
    queryKey: postKeys.single(postId),
    queryFn: () => getPost(postId),
  });

  return { post, error, isLoading };
};
