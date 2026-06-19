import { useComments } from "@/hooks/comments/useComments";
import CommentCard from "./CommentCard";
import { useUIStore } from "@/store/useUIStore";
import CommentCardSkeleton from "./CommentCardSkeleton";
import { Button } from "../ui/button";
import { useAuthStore } from "@/store/useAuthStore";

type ReplyProps = {
  postId: string;
  parentId: string;
  showReplies: boolean;
};

export default function Replies({ postId, parentId, showReplies }: ReplyProps) {
  const { setReplyingCommentId, setEditingComment } = useUIStore();
  const { user } = useAuthStore();
  const {
    comments,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
    status,
  } = useComments({ postId, parentId, enabled: showReplies });

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
              onDelete={handleDeleteComment}
              onEdit={setEditingComment}
              onReply={setReplyingCommentId}
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
