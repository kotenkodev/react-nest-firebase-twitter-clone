import type { Post } from "@/types/post.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
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
