import { postKeys } from "@/lib/queryKeys";
import { deletePost as deletePostApi } from "@/services/postsService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async (postId: string) => {
      await deletePostApi(postId);
    },
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      queryClient.invalidateQueries({ queryKey: postKeys.single(postId) });
    },
    onError: (error) => {
      console.error("Error deleting post:", error);
    },
  });

  return { deletePost, isDeleting };
};
