import type { Post } from "@/types/post";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  DeleteIcon,
  EditIcon,
  MessageCircleIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/utils/getInitials";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Button } from "../ui/button";
import TransitionLink from "../TransitionLink";

dayjs.extend(relativeTime);

type PostCardProps = {
  post: Post;
  currentUserId?: string;
  onLike: (postId: string, type: "like" | "dislike") => void;
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
  reactionType?: "like" | "dislike" | null;
};

export default function PostCard({
  post,
  currentUserId,
  onLike,
  onEdit,
  onDelete,
  reactionType,
}: PostCardProps) {
  const [titleExpanded, setTitleExpanded] = useState(false);
  const [contentExpanded, setContentExpanded] = useState(false);
  const isOwner = post.authorId === currentUserId;
  const location = useLocation();

  return (
    <Card className="overflow-hidden">
      {post.photoURL && (
        <div className="relative w-full flex justify-center overflow-hidden">
          <img
            src={post.photoURL}
            alt="Post media"
            className="max-h-80 w-auto max-w-full object-contain transition-transform duration-300 hover:scale-[1.02]"
          />
        </div>
      )}
      <CardHeader>
        <TransitionLink
          to={`/profile/${post.authorId}`}
          className="flex items-center gap-3 w-fit self-start no-underline group"
        >
          <Avatar className="h-10 w-10 border shadow-sm group-hover:opacity-90 transition-opacity">
            <AvatarImage
              src={post.author?.photoURL}
              alt={post.author?.firstName}
            />
            <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-semibold">
              {getInitials(
                `${post.author?.firstName} ${post.author?.lastName}`,
              )}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-foreground group-hover:underline">
              {post.author?.firstName} {post.author?.lastName}
            </span>
            <span className="text-xs text-muted-foreground">
              {dayjs(post.createdAt).fromNow()}
            </span>
          </div>
        </TransitionLink>

        <CardTitle>
          <p
            onClick={() => setTitleExpanded(!titleExpanded)}
            className={`cursor-pointer break-all ${titleExpanded ? "whitespace-pre-wrap" : "line-clamp-1"}`}
          >
            {post.title}
          </p>
        </CardTitle>
        <CardDescription>
          <p
            className={`break-all ${contentExpanded ? "whitespace-pre-wrap" : "line-clamp-3"}`}
          >
            {post.content}
          </p>
          {post.content.length > 150 && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setContentExpanded(!contentExpanded)}
              className="text-xs font-semibold text-primary hover:underline"
            >
              {contentExpanded ? "Show less" : "Show more"}
            </Button>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between">
        <div className="flex items-center gap-4">
          {isOwner && (
            <>
              <Button variant="secondary" onClick={() => onEdit(post)}>
                <EditIcon className="w-5 h-5" />
              </Button>
              <Button variant="secondary" onClick={() => onDelete(post.id)}>
                <DeleteIcon className="w-5 h-5" />
              </Button>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Link to={`/post/${post.id}`} state={{ background: location }}>
            <Badge variant="secondary">
              <MessageCircleIcon className="w-5 h-5" />
              {post.commentsCount}
            </Badge>
          </Link>
          <Badge
            onClick={() => onLike(post.id, "like")}
            className={
              reactionType === "like"
                ? "bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer"
                : "cursor-pointer"
            }
            variant="secondary"
          >
            <ThumbsUpIcon className="w-5 h-5" />
            {post.likesCount}
          </Badge>
          <Badge
            onClick={() => onLike(post.id, "dislike")}
            className={
              reactionType === "dislike"
                ? "bg-red-100 text-red-800 hover:bg-red-200 cursor-pointer"
                : "cursor-pointer"
            }
            variant="secondary"
          >
            <ThumbsDownIcon className="w-5 h-5" />
            {post.dislikesCount}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
