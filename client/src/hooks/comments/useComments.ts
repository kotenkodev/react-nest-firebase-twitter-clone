import { commentKeys } from "@/lib/queryKeys";
import { getComments } from "@/services/commentService";
import { useInfiniteQuery } from "@tanstack/react-query";

type UseCommentsOptions = {
  postId?: string;
  parentId?: string;
  enabled?: boolean;
};

export const useComments = ({
  postId,
  parentId,
  enabled = true,
}: UseCommentsOptions) => {
  const queryKey = parentId
    ? commentKeys.replies(parentId)
    : commentKeys.list(postId!);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isFetching,
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => getComments(postId, parentId, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
    enabled: enabled && (!!postId || !!parentId),
  });

  return {
    comments: data?.pages.flatMap((page) => page.comments) || [],
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isFetching,
  };
};
