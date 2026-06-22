import { postKeys } from "@/lib/queryKeys";
import { deletePost as deletePostApi } from "@/services/postsService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Post } from "@/types/post.types";

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async (postId: string) => {
      await deletePostApi(postId);
    },
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      queryClient.invalidateQueries({ queryKey: postKeys.single(postId) });
      queryClient.setQueryData<Post | null>(postKeys.single(postId), null);
    },
    onError: (error) => {
      console.error("Error deleting post:", error);
    },
  });

  return { deletePost, isDeleting };
};
