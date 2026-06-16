import { Badge } from "../ui/badge";
import { ThumbsDownIcon, ThumbsUpIcon, MessageCircleIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PostReactionsProps {
  postId: string;
  likesCount: number;
  dislikesCount: number;
  commentsCount?: number;
  userLike?: "like" | "dislike" | null;
  onLike: (postId: string, type: "like" | "dislike") => void;
  showComments?: boolean;
  className?: string;
}

export function PostReactions({
  postId,
  likesCount,
  dislikesCount,
  commentsCount = 0,
  userLike,
  onLike,
  showComments = true,
  className,
}: PostReactionsProps) {
  const location = useLocation();

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {showComments && (
        <Link to={`/post/${postId}`} state={{ background: location }}>
          <Badge
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full transition-colors cursor-pointer",
              commentsCount > 0
                ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                : "bg-muted text-muted-foreground hover:bg-muted-foreground/20",
            )}
            variant="secondary"
          >
            <MessageCircleIcon className="w-4 h-4" />
            <span className="font-semibold">{commentsCount}</span>
          </Badge>
        </Link>
      )}

      <Badge
        onClick={() => onLike(postId, "like")}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full transition-colors cursor-pointer shadow-sm",
          userLike === "like"
            ? "bg-green-100 text-green-800 hover:bg-green-200"
            : "hover:bg-muted",
        )}
        variant="secondary"
      >
        <ThumbsUpIcon className="w-4 h-4" />
        <span className="font-semibold">{likesCount}</span>
      </Badge>

      <Badge
        onClick={() => onLike(postId, "dislike")}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full transition-colors cursor-pointer shadow-sm",
          userLike === "dislike"
            ? "bg-red-100 text-red-800 hover:bg-red-200"
            : "hover:bg-muted",
        )}
        variant="secondary"
      >
        <ThumbsDownIcon className="w-4 h-4" />
        <span className="font-semibold">{dislikesCount}</span>
      </Badge>
    </div>
  );
}
