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
import { toast } from "sonner";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/utils/getInitials";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Button } from "../ui/button";
import TransitionLink from "../TransitionLink";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import { deletePost } from "@/services/postsService";

dayjs.extend(relativeTime);

export default function PostCard({ post }: { post: Post }) {
  const [titleExpanded, setTitleExpanded] = useState(false);
  const [contentExpanded, setContentExpanded] = useState(false);
  const { user } = useAuthStore();
  const { setPostDialogOpen, setEditingPost } = useUIStore();
  const isOwner = post.authorId === user?.id;

  const location = useLocation();

  const likedStyles =
    "bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer";
  const dislikedStyles =
    "bg-red-100 text-red-800 hover:bg-red-200 cursor-pointer";

  function handleLikeClick(like: "like" | "dislike") {
    try {
      toast.success(`You ${like}d the post!`);
    } catch (error) {
      console.error(`Error handling ${like}:`, error);
    }
  }

  const openEditDialog = (post: Post) => {
    try {
      setEditingPost(post);
      setPostDialogOpen(true);
    } catch (error) {
      console.error("Error opening edit dialog:", error);
    }
  };

  const handleDeletePost = async () => {
    try {
      // confrim dialog...

      await deletePost(post.id);

      toast.success("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post. Please try again.");
    }
  };

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
              <Button variant="secondary" onClick={() => openEditDialog(post)}>
                <EditIcon className="w-5 h-5" />
              </Button>
              <Button variant="secondary" onClick={handleDeletePost}>
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
            onClick={() => handleLikeClick("like")}
            className={likedStyles}
            variant="secondary"
          >
            <ThumbsUpIcon className="w-5 h-5" />
            {post.likesCount}
          </Badge>
          <Badge
            onClick={() => handleLikeClick("dislike")}
            className={dislikedStyles}
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
