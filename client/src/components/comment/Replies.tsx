import { useComments } from "@/hooks/comments/useComments";
import CommentCard from "./CommentCard";
import { useUIStore } from "@/store/useUIStore";
import CommentCardSkeleton from "./CommentCardSkeleton";
import { Button } from "../ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { useDeleteComment } from "@/hooks/comments/useDeleteComment";
import { toast } from "sonner";

type ReplyProps = {
  postId: string;
  parentId: string;
  showReplies: boolean;
};

export default function Replies({ postId, parentId, showReplies }: ReplyProps) {
  const { setReplyingComment, setEditingComment } = useUIStore();
  const { user } = useAuthStore();
  const { deleteComment, isDeleting } = useDeleteComment();
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

  const handleDeleteComment = (commentId: string) => {
    deleteComment(
      {
        postId,
        commentId,
      },
      {
        onSuccess: () => {
          toast.success("Comment deleted successfully!");
        },
        onError: () => {
          toast.error("Failed to delete comment. Please try again.");
        },
      },
    );
  };

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
              onReply={setReplyingComment}
            />
          </li>
        ))}
        {isFetchingNextPage &&
          Array.from({ length: 1 }).map((_, index) => (
            <li key={`skeleton-${index}`} className="list-none m-0 p-0 pl-11">
              <CommentCardSkeleton />
            </li>
          ))}
      </ul>
      {hasNextPage ? (
        <div className="flex justify-start mt-2 pl-11">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetching}
            variant="ghost"
            size="sm"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/30 cursor-pointer h-7 py-1 px-2.5 rounded-lg"
          >
            {isFetchingNextPage ? "Loading more..." : "Load more replies"}
          </Button>
        </div>
      ) : (
        comments.length > 0 && (
          <div className="flex items-center gap-2 pl-11 py-2 text-[10px] font-semibold text-muted-foreground/35 tracking-wider uppercase select-none">
            <span className="w-1 h-1 rounded-full bg-muted-foreground/25" />
            <span>no more replies</span>
          </div>
        )
      )}
    </>
  );
}
