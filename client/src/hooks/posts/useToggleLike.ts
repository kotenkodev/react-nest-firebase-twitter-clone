import { postKeys } from "@/lib/queryKeys";
import { likePost } from "@/services/likesService";
import type { Post } from "@/types/post.types";
import type { LikeType } from "@/types/like.types";
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import type { PaginatedPostsResponse } from "@/services/postsService";

type ToggleLikeParams = {
  postId: string;
  likeType: LikeType;
};

export function useToggleLike() {
  const queryClient = useQueryClient();

  const { mutate: toggleLike } = useMutation({
    mutationFn: async ({ postId, likeType }: ToggleLikeParams) => {
      await likePost(postId, { type: likeType });
    },
    onMutate: async ({ postId, likeType }) => {
      await queryClient.cancelQueries({ queryKey: postKeys.all });
      await queryClient.cancelQueries({ queryKey: postKeys.single(postId) });

      const previousFeed = queryClient.getQueriesData({
        queryKey: postKeys.all,
      });
      const previousSinglePost = queryClient.getQueryData<Post>(
        postKeys.single(postId),
      );

      queryClient.setQueriesData(
        { queryKey: postKeys.all },
        (oldData: InfiniteData<PaginatedPostsResponse> | undefined) => {
          if (!oldData?.pages) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page: PaginatedPostsResponse) => ({
              ...page,
              posts: page.posts.map((post: Post) => {
                if (post.id !== postId) return post;

                const isSameReaction = post.userLike === likeType;
                const newReaction = isSameReaction ? null : likeType;

                return {
                  ...post,
                  userLike: newReaction,
                  likesCount:
                    post.likesCount +
                    (newReaction === "like" ? 1 : 0) -
                    (post.userLike === "like" ? 1 : 0),
                  dislikesCount:
                    post.dislikesCount +
                    (newReaction === "dislike" ? 1 : 0) -
                    (post.userLike === "dislike" ? 1 : 0),
                };
              }),
            })),
          };
        },
      );

      queryClient.setQueryData(
        postKeys.single(postId),
        (oldPost: Post | undefined) => {
          if (!oldPost) return oldPost;

          const isSameReaction = oldPost.userLike === likeType;
          const newReaction = isSameReaction ? null : likeType;

          return {
            ...oldPost,
            userLike: newReaction,
            likesCount:
              oldPost.likesCount +
              (newReaction === "like" ? 1 : 0) -
              (oldPost.userLike === "like" ? 1 : 0),
            dislikesCount:
              oldPost.dislikesCount +
              (newReaction === "dislike" ? 1 : 0) -
              (oldPost.userLike === "dislike" ? 1 : 0),
          };
        },
      );

      return { previousFeed, previousSinglePost };
    },

    onError: (_err, variables, context) => {
      if (context?.previousFeed) {
        context.previousFeed.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousSinglePost) {
        queryClient.setQueryData(
          postKeys.single(variables.postId),
          context.previousSinglePost,
        );
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: postKeys.single(variables.postId),
      });
    },
  });

  return { toggleLike };
}
