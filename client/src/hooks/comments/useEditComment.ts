import { updateComment } from "@/services/commentService";
import type { UpdateComment } from "@/types/comment.types";
import { useMutation } from "@tanstack/react-query";

export const useEditComment = () => {
  const { mutate: editComment, isPending: isLoading } = useMutation({
    mutationFn: (commentId: string, data: UpdateComment) =>
      updateComment(commentId, data),
    onSuccess: () => {},
  });

  return { editComment, isLoading };
};
