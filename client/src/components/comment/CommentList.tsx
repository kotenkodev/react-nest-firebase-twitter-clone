import CommentCard from "./CommentCard";
import { useComments } from "@/hooks/comments/useComments";
import { Button } from "../ui/button";
import CommentCardSkeleton from "./CommentCardSkeleton";
import { useUIStore } from "@/store/useUIStore";
import { useAuthStore } from "@/store/useAuthStore";

type CommentListProps = {
  postId: string;
};

export default function CommentList({ postId }: CommentListProps) {
  const { setReplyingComment, setEditingComment } = useUIStore();
  const { user } = useAuthStore();

  // show skeletons
  const {
    comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
    isFetching,
  } = useComments({ postId });

  if (status === "pending") {
    return (
      <ul className="flex flex-col space-y-6 md:space-y-8 w-full max-w-2xl mx-auto pb-10">
        {Array.from({ length: 5 }).map((_, index) => (
          <li key={index} className="list-none w-full">
            <CommentCardSkeleton />
          </li>
        ))}
      </ul>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center py-4 text-sm text-red-500 font-medium bg-red-50 dark:bg-red-950/10 rounded-xl border border-red-200 dark:border-red-950/30">
        Failed to load comments. Please try again.
      </div>
    );
  }

  const handleDeleteComment = (commentId: string) => {};

  return (
    <>
      <ul className="flex flex-col gap-3 p-0 m-0 list-none">
        {comments.map((comment) => (
          <li key={comment.id} className="list-none m-0 p-0">
            <CommentCard
              comment={comment}
              currentUserId={user?.id}
              onReply={setReplyingComment}
              onDelete={handleDeleteComment}
              onEdit={setEditingComment}
            />
          </li>
        ))}
      </ul>
      {hasNextPage && (
        <div className="flex justify-center mt-4 mb-2">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetching}
            variant="ghost"
            size="sm"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer"
          >
            {isFetchingNextPage ? "Loading more..." : "Load more comments"}
          </Button>
        </div>
      )}
    </>
  );
}
