import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost as createPostApi } from "@/services/postsService";
import { postKeys } from "@/lib/queryKeys";
import type { CreatePost } from "@/types/post.types";

type CreatePostParams = CreatePost;

export function useCreatePost() {
  const queryClient = useQueryClient();

  const { mutate: createPost, isPending: isCreating } = useMutation({
    mutationFn: (newPostData: CreatePostParams) => createPostApi(newPostData),
    onSuccess: (newPost, variables) => {
      queryClient.invalidateQueries({
        queryKey: postKeys.single(variables.id),
      });

      queryClient.invalidateQueries({ queryKey: postKeys.feed() });

      queryClient.invalidateQueries({
        queryKey: postKeys.userFeed(newPost.authorId),
      });
    },
  });

  return { createPost, isCreating };
}
