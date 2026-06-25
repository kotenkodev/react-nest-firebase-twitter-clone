import type { Post } from "@/types/post.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { PostAuthor } from "./PostAuthor";
import { PostReactions } from "./PostReactions";
import { PostActions } from "./PostActions";
import type { LikeType } from "@/types/like.types";

type PostCardProps = {
  post: Post;
  currentUserId?: string;
  onLike: (postId: string, type: LikeType) => void;
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
  userLike?: LikeType | null;
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
  const [isImageLoading, setIsImageLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setIsImageLoading(true);
  }, [post.id, post.photoURL]);

  return (
    <Card className="overflow-hidden shadow-sm border-muted/60 hover:border-muted-foreground/20 transition-colors">
      {post.photoURL && (
        <div className="relative w-full h-64 sm:h-80 bg-muted/20 overflow-hidden flex items-center justify-center">
          {isImageLoading && (
            <div className="absolute inset-0 bg-muted/40 animate-pulse flex items-center justify-center">
              <svg
                className="w-10 h-10 text-muted-foreground/30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          <Link
            to={`/post/${post.id}`}
            state={{ background: location }}
            className="w-full h-full flex items-center justify-center"
          >
            <img
              src={post.photoURL}
              alt="Post media"
              onLoad={() => setIsImageLoading(false)}
              className={`w-full h-full object-contain transition-all duration-300 ${
                isImageLoading ? "opacity-0 scale-95" : "opacity-100 scale-100"
              } hover:opacity-80`}
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
          isVerified={post.author?.emailVerified}
          createdAt={post.createdAt}
          isEdited={post.isEdited}
          updatedAt={post.updatedAt}
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
        <PostActions
          post={post}
          currentUserId={currentUserId}
          onEdit={onEdit}
          onDelete={onDelete}
        />

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
