import { postKeys, type PostFilters } from "@/lib/queryKeys";
import { getPosts } from "@/services/postsService";
import { useInfiniteQuery } from "@tanstack/react-query";

type UsePostsOptions = PostFilters & {
  userId?: string;
};

export const usePosts = (options: UsePostsOptions = {}) => {
  const { userId, ...filters } = options;

  const queryKey = userId
    ? postKeys.userFeed(userId, filters)
    : postKeys.feed(filters);

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
    queryFn: ({ pageParam }) => getPosts({ ...options, cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
    gcTime: 1000 * 60 * 1,
  });

  return {
    posts: data?.pages.flatMap((page) => page.posts) || [],
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isFetching,
  };
};
