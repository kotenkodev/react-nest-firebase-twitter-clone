import { deleteComment as deleteCommentApi } from "@/services/commentService";
import { useMutation } from "@tanstack/react-query";

export const useDeleteComment = () => {
  const { mutate: deleteComment, isPending: isLoading } = useMutation({
    mutationFn: (commentId: string) => deleteCommentApi(commentId),
    onSuccess: () => {},
  });

  return { deleteComment, isLoading };
};
