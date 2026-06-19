import { createComment as createCommentApi } from "@/services/commentService";
import type { CreateComment } from "@/types/comment.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentKeys } from "@/lib/queryKeys";

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  const { mutate: createComment, isPending: isCreating } = useMutation({
    mutationFn: ({ postId, data }: { postId: string; data: CreateComment }) =>
      createCommentApi(postId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(variables.postId),
      });
      if (variables.data.parentId) {
        queryClient.invalidateQueries({
          queryKey: commentKeys.replies(variables.data.parentId),
        });
      }
    },
  });

  return { createComment, isCreating };
};
