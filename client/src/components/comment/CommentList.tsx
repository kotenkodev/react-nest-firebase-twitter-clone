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
  const { setReplyingCommentId, setEditingComment } = useUIStore();
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

  const handleDeleteComment = (commentId: string) => {};

  return (
    <>
      <ul className="flex flex-col gap-3 p-0 m-0 list-none">
        {comments.map((comment) => (
          <li key={comment.id} className="list-none m-0 p-0">
            <CommentCard
              comment={comment}
              currentUserId={user?.id}
              onReply={setReplyingCommentId}
              onDelete={handleDeleteComment}
              onEdit={setEditingComment}
            />
          </li>
        ))}
      </ul>
      <div>
        <Button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetching}
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
              ? "Load More"
              : "Nothing more to load"}
        </Button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
    </>
  );
}
