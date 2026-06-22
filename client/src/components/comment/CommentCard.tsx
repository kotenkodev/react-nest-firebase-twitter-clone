import type { Comment } from "@/types/comment.types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/utils/getInitials";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Button } from "../ui/button";
import { EditIcon, TrashIcon, MessageSquareIcon } from "lucide-react";
import { useState } from "react";
import TransitionLink from "../TransitionLink";
import Replies from "./Replies";

dayjs.extend(relativeTime);

type CommentCardProps = {
  comment: Comment;
  currentUserId?: string;
  onEdit: (comment: Comment) => void;
  onDelete: (commentId: string, parentId?: string) => void;
  onReply: (comment: Comment) => void;
};

export default function CommentCard({
  comment,
  currentUserId,
  onEdit,
  onDelete,
  onReply,
}: CommentCardProps) {
  const [contentExpanded, setContentExpanded] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const isOwner = comment.authorId === currentUserId;
  const isAuthorDeleted = comment.authorId === "deleted_user";
  const isCommentDeleted = comment.isDeleted && comment.content === "[deleted]";
  const fullName =
    `${comment.author.firstName} ${comment.author.lastName || ""}`.trim();

  return (
    <>
      <div
        className={`flex items-start gap-3 p-3 text-left rounded-xl border border-transparent hover:border-muted/60 bg-card transition-all ${
          isCommentDeleted ? "opacity-60 select-none" : ""
        }`}
      >
        {isAuthorDeleted ? (
          <div className="shrink-0 select-none">
            <Avatar className="h-8 w-8 border shadow-sm">
              <AvatarImage
                src={comment.author.photoURL}
                alt={fullName}
                className="object-cover"
              />
              <AvatarFallback className="bg-secondary text-secondary-foreground font-bold text-[10px]">
                {getInitials(fullName)}
              </AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <TransitionLink
            to={`/profile/${comment.authorId}`}
            className="shrink-0"
          >
            <Avatar className="h-8 w-8 border shadow-sm">
              <AvatarImage
                src={comment.author.photoURL}
                alt={fullName}
                className="object-cover"
              />
              <AvatarFallback className="bg-secondary text-secondary-foreground font-bold text-[10px]">
                {getInitials(fullName)}
              </AvatarFallback>
            </Avatar>
          </TransitionLink>
        )}

        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-2 min-w-0">
              {isAuthorDeleted ? (
                <span className="font-bold text-sm tracking-tight text-foreground truncate select-none">
                  {fullName}
                </span>
              ) : (
                <TransitionLink
                  to={`/profile/${comment.authorId}`}
                  className="font-bold text-sm tracking-tight text-foreground hover:underline truncate"
                >
                  {fullName}
                </TransitionLink>
              )}
              <span className="text-xs text-muted-foreground shrink-0 select-none">
                {dayjs(comment.createdAt).fromNow()}
                {comment.isEdited && (
                  <span className="ml-1 text-[10px] italic font-normal text-muted-foreground/80">
                    (edited)
                  </span>
                )}
              </span>
            </div>

            {isOwner && !isCommentDeleted && (
              <div className="flex items-center gap-0.5 shrink-0">
                <Button
                  size="icon-xs"
                  variant="ghost"
                  className="text-muted-foreground hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950/20 cursor-pointer"
                  onClick={() => onEdit(comment)}
                  title="Edit comment"
                >
                  <EditIcon className="w-3.5 h-3.5" />
                </Button>
                <Button
                  size="icon-xs"
                  variant="ghost"
                  className="text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                  onClick={() => onDelete(comment.id, comment.parentId)}
                  title="Delete comment"
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
          </div>

          <div className="text-sm text-foreground/90 wrap-break-word leading-relaxed">
            {isCommentDeleted ? (
              <span className="italic text-muted-foreground font-normal">
                [deleted]
              </span>
            ) : (
              <>
                <p
                  className={
                    contentExpanded ? "whitespace-pre-wrap" : "line-clamp-3"
                  }
                >
                  {comment.content}
                </p>
                {comment.content.length > 180 && (
                  <button
                    type="button"
                    onClick={() => setContentExpanded(!contentExpanded)}
                    className="text-xs font-semibold text-primary hover:underline mt-1 block cursor-pointer"
                  >
                    {contentExpanded ? "Show less" : "Show more"}
                  </button>
                )}
              </>
            )}
          </div>

          <div className="flex items-center justify-between gap-1.5 text-xs text-muted-foreground mt-0.5 select-none">
            {comment.replyCount > 0 ? (
              <div
                className="flex gap-1 cursor-pointer hover:text-foreground"
                onClick={() => setShowReplies(!showReplies)}
              >
                <MessageSquareIcon className="w-3.5 h-3.5" />
                <span>
                  {showReplies ? "hide " : "see "} {comment.replyCount}{" "}
                  {comment.replyCount === 1 ? "reply" : "replies"}
                </span>
              </div>
            ) : (
              !isCommentDeleted && (
                <span className="text-muted-foreground/60 select-none">
                  no replies
                </span>
              )
            )}
            {!isCommentDeleted && (
              <div
                className="flex gap-1 cursor-pointer hover:text-foreground"
                onClick={() => onReply(comment)}
              >
                <span>write a reply</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {showReplies && (
        <Replies
          postId={comment.postId}
          parentId={comment.id}
          showReplies={showReplies}
        />
      )}
    </>
  );
}
