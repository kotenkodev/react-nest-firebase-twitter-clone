import { commentKeys, postKeys } from "@/lib/queryKeys";
import { deleteComment as deleteCommentApi } from "@/services/commentService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  const { mutate: deleteComment, isPending: isDeleting } = useMutation({
    mutationFn: ({
      postId,
      commentId,
      parentId,
    }: {
      postId: string;
      commentId: string;
      parentId?: string;
    }) => deleteCommentApi(postId, commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: postKeys.single(variables.postId),
      });
      queryClient.invalidateQueries({
        queryKey: postKeys.all,
      });
    },
  });

  return { deleteComment, isDeleting };
};
