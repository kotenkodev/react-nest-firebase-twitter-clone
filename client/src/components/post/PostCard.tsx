import type { Post } from "@/types/post";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { EditIcon, TrashIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "../ui/button";
import { PostAuthor } from "./PostAuthor";
import { PostReactions } from "./PostReactions";

type PostCardProps = {
  post: Post;
  currentUserId?: string;
  onLike: (postId: string, type: "like" | "dislike") => void;
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
  userLike?: "like" | "dislike" | null;
};

export default function PostCard({
  post,
  currentUserId,
  onLike,
  onEdit,
  onDelete,
  userLike: reactionType,
}: PostCardProps) {
  const [titleExpanded, setTitleExpanded] = useState(false);
  const [contentExpanded, setContentExpanded] = useState(false);
  const isOwner = post.authorId === currentUserId;
  const location = useLocation();

  return (
    <Card className="overflow-hidden shadow-sm border-muted/60 hover:border-muted-foreground/20 transition-colors">
      {post.photoURL && (
        <div className="relative w-full flex justify-center overflow-hidden bg-muted/20">
          <Link to={`/post/${post.id}`} state={{ background: location }}>
            <img
              src={post.photoURL}
              alt="Post media"
              className="max-h-80 w-auto max-w-full object-contain transition-transform duration-300 hover:scale-[1.02]"
            />
          </Link>
        </div>
      )}
      <CardHeader className="space-y-4">
        <PostAuthor
          authorId={post.authorId}
          firstName={post.author?.firstName}
          lastName={post.author?.lastName}
          photoURL={post.author?.photoURL}
          createdAt={post.createdAt}
        />

        <div className="space-y-2">
          <CardTitle>
            <p
              onClick={() => setTitleExpanded(!titleExpanded)}
              className={`cursor-pointer break-all text-xl font-bold tracking-tight ${titleExpanded ? "whitespace-pre-wrap" : "line-clamp-1"}`}
            >
              {post.title}
            </p>
          </CardTitle>
          <CardDescription>
            <p
              className={`break-all text-base text-foreground/80 leading-relaxed ${contentExpanded ? "whitespace-pre-wrap" : "line-clamp-3"}`}
            >
              {post.content}
            </p>
            {post.content.length > 150 && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setContentExpanded(!contentExpanded)}
                className="h-auto p-0 mt-1 text-xs font-bold text-primary hover:bg-transparent hover:underline"
              >
                {contentExpanded ? "Show less" : "Show more"}
              </Button>
            )}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex justify-between items-center pt-0">
        <div className="flex items-center gap-2">
          {isOwner && (
            <>
              <Button
                size="icon-sm"
                className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-100 cursor-pointer shadow-none"
                variant="secondary"
                onClick={() => onEdit(post)}
              >
                <EditIcon className="w-4 h-4" />
              </Button>
              <Button
                size="icon-sm"
                className="bg-red-50 text-red-700 hover:bg-red-100 border-red-100 cursor-pointer shadow-none"
                variant="secondary"
                onClick={() => onDelete(post.id)}
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>

        <PostReactions
          postId={post.id}
          likesCount={post.likesCount}
          dislikesCount={post.dislikesCount}
          commentsCount={post.commentsCount}
          userLike={reactionType}
          onLike={onLike}
        />
      </CardContent>
    </Card>
  );
}
