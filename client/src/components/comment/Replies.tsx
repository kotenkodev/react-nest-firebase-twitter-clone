import { useReplies } from "@/hooks/comments/useComments";
import CommentCard from "./CommentCard";
import type { Comment } from "@/types/comment.types";
import { useUIStore } from "@/store/useUIStore";

type ReplyProps = {
  parentId: string;
  showReplies: boolean;
};

const replies: Comment[] = [
  {
    id: "c12",
    content: "Great post! Really enjoyed reading it.",
    authorId: "u1",
    author: {
      firstName: "John",
      photoURL: "https://i.pravatar.cc/150?img=1",
    },
    isDeleted: false,
    replyCount: 2,
    createdAt: new Date("2026-06-16T10:00:00Z"),
    updatedAt: new Date("2026-06-16T10:00:00Z"),
  },
  {
    id: "c2",
    content: "I completely agree with your point.",
    authorId: "u2",
    parentId: "c1",
    author: {
      firstName: "Emma",
      lastName: "Wilson",
      photoURL: "https://i.pravatar.cc/150?img=2",
    },
    isDeleted: false,
    replyCount: 0,
    createdAt: new Date("2026-06-16T10:05:00Z"),
    updatedAt: new Date("2026-06-16T10:05:00Z"),
  },
  {
    id: "c3",
    content: "Interesting perspective. Thanks for sharing!",
    authorId: "u3",
    parentId: "c1",
    author: {
      firstName: "Michael",
      lastName: "Brown",
      photoURL: "https://i.pravatar.cc/150?img=3",
    },
    isDeleted: false,
    replyCount: 1,
    createdAt: new Date("2026-06-16T10:10:00Z"),
    updatedAt: new Date("2026-06-16T10:10:00Z"),
  },
];

export default function Replies({ parentId, showReplies }: ReplyProps) {
  const { setReplyingCommentId, setEditingComment } = useUIStore();
  // const { replies, hasNextPage, isFetchingNextPage, fetchNextPage } =
  //   useReplies(parentId, showReplies);

  // if (status === "pending") {
  //   return (
  //     <ul className="flex flex-col space-y-6 md:space-y-8 w-full max-w-2xl mx-auto pb-10">
  //       {Array.from({ length: 5 }).map((_, index) => (
  //         <li key={index} className="list-none w-full">
  // <CommentCardSkeleton />
  //         </li>
  //       ))}
  //     </ul>
  //   );
  // }

  return (
    <>
      <ul className="flex flex-col gap-3 p-0 m-0 list-none">
        {replies.map((comment) => (
          <li key={comment.id} className="list-none m-0 p-0">
            <CommentCard
              comment={comment}
              onDelete={() => {}}
              onEdit={setEditingComment}
              onReply={setReplyingCommentId}
            />
          </li>
        ))}
      </ul>
      {/* <div>
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
      <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>  */}
    </>
  );
}
