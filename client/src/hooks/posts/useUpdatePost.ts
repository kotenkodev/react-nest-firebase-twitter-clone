import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePost as updatePostApi } from "@/services/postsService";
import { postKeys } from "@/lib/queryKeys";
import type { Post, UpdatePost } from "@/types/post.types";

type UpdatePostParams = {
  postId: string;
  data: UpdatePost;
};

type PostsInfiniteData = {
  pages: {
    posts: Post[];
  }[];
};

export function useUpdatePost() {
  const queryClient = useQueryClient();

  const { mutate: updatePost, isPending: isUpdating } = useMutation<
    Post,
    Error,
    UpdatePostParams
  >({
    mutationFn: ({ postId, data }) => updatePostApi(postId, data),

    onSuccess: (updatedPost) => {
      queryClient.setQueriesData<PostsInfiniteData>(
        { queryKey: postKeys.all },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              posts: page.posts.map((post) =>
                post.id === updatedPost.id ? { ...post, ...updatedPost } : post,
              ),
            })),
          };
        },
      );

      queryClient.setQueryData<Post>(
        postKeys.single(updatedPost.id),
        (oldPost) => {
          if (!oldPost) return oldPost;
          return { ...oldPost, ...updatedPost };
        },
      );
    },

    onError: (error) => {
      console.error("Error updating post:", error);
    },
  });

  return { updatePost, isUpdating };
}
