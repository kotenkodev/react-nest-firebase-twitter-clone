import { deleteComment as deleteCommentApi } from "@/services/commentService";
import { useMutation } from "@tanstack/react-query";

export const useDeleteComment = () => {
  const { mutate: deleteComment, isPending: isDeleting } = useMutation({
    mutationFn: ({
      postId,
      commentId,
    }: {
      postId: string;
      commentId: string;
    }) => deleteCommentApi(postId, commentId),
    onSuccess: () => {},
  });

  return { deleteComment, isDeleting };
};
