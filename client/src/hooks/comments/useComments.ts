import { commentKeys } from "@/lib/queryKeys";
import { getComments } from "@/services/commentService";
import { useQuery } from "@tanstack/react-query";

export const useComments = () => {
  const { data: comments, isLoading } = useQuery({
    queryKey: commentKeys.list(postId),
    queryFn: () => getComments(limit, postId, undefined, cursor),
  });
};

export const useReplies = (parentId: string) => {
  const { data: replies, isLoading } = useQuery({
    queryKey: commentKeys.replies(parentId),
    queryFn: () => getComments(limit, undefined, parentId, cursor),
  });
};
