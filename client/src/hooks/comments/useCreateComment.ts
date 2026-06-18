import { createComment as createCommentApi } from "@/services/commentService";
import type { CreateComment } from "@/types/comment.types";
import { useMutation } from "@tanstack/react-query";

export const useCreateComment = () => {
  const { mutate: createComment, isPending: isLoading } = useMutation({
    mutationFn: (data: CreateComment) => createCommentApi(data),
    onSuccess: () => {},
  });

  return { createComment, isLoading };
};
