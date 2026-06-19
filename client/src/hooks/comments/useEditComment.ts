import { updateComment } from "@/services/commentService";
import type { UpdateComment } from "@/types/comment.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentKeys } from "@/lib/queryKeys";

export const useEditComment = () => {
  const queryClient = useQueryClient();
  const { mutate: editComment, isPending: isEditing } = useMutation({
    mutationFn: ({
      postId,
      commentId,
      data,
    }: {
      postId: string;
      commentId: string;
      data: UpdateComment;
    }) => updateComment(postId, commentId, data),
    onSuccess: (updatedComment, variables) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(variables.postId),
      });
      if (updatedComment?.parentId) {
        queryClient.invalidateQueries({
          queryKey: commentKeys.replies(updatedComment.parentId),
        });
      }
    },
  });

  return { editComment, isEditing };
};
