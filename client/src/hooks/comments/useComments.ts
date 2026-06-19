import { commentKeys } from "@/lib/queryKeys";
import { getComments } from "@/services/commentService";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useComments = (postId: string) => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: commentKeys.list(postId),
    queryFn: ({ pageParam }) => getComments(10, postId, undefined, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
  });

  return {
    comments: data?.pages.flatMap((page) => page.comments) || [],
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};

export const useReplies = (parentId: string, enabled: boolean) => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: commentKeys.replies(parentId),
    queryFn: ({ pageParam }) => getComments(10, undefined, parentId, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
    enabled,
  });

  return {
    replies: data?.pages.flatMap((page) => page.replies) || [],
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};
