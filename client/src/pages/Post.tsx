import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { PostDetailSkeleton } from "@/components/post/PostDetailSkeleton";
import type { Post } from "@/types/post.types";
import { PostAuthor } from "@/components/post/PostAuthor";
import { PostReactions } from "@/components/post/PostReactions";
import { useToggleLike } from "@/hooks/posts/useToggleLike";
import ItemNotFound from "@/components/ItemNotFound";
import { toast } from "sonner";
import { usePost } from "@/hooks/posts/usePost";
import { useAuthStore } from "@/store/useAuthStore";
import CommentList from "@/components/comment/CommentList";
import CommentInput from "@/components/comment/CommentInput";

type PostProps = {
  isModal?: boolean;
};

export default function Post({ isModal }: PostProps) {
  const { user } = useAuthStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleLike } = useToggleLike();
  const { post, error, isLoading } = usePost(id!);

  const handleClose = () => navigate(-1);

  const handleLikeClick = async (postId: string, like: "like" | "dislike") => {
    toggleLike(
      { postId, likeType: like },
      {
        onError: () => {
          if (user) {
            toast.error("Failed to toggle like. Please try again.");
          } else {
            toast.error("You must be signed in to like or dislike a post.");
          }
        },
      },
    );
  };

  useEffect(() => {
    if (!isModal && post) {
      document.title = `${post?.title} - Post by ${post?.author?.firstName} ${post?.author?.lastName} / Birb`;
    }
  }, [isModal, post]);

  const renderContent = () => {
    if (isLoading) return <PostDetailSkeleton />;

    if (!post) {
      return (
        <ItemNotFound
          title="Post Not Found"
          message="The post you are looking for might have been deleted or moved to another nest."
          errorCode="404"
          backLinkText="Back to Home"
          backLinkTo="/"
        />
      );
    }

    return (
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-5 items-start">
        <div className="lg:col-span-3 space-y-6">
          {post.photoURL && (
            <div className="relative w-full flex justify-center overflow-hidden rounded-xl border bg-muted/20">
              <img
                src={post.photoURL}
                alt="Post media"
                className="max-h-125 w-auto max-w-full object-contain transition-transform duration-300"
              />
            </div>
          )}

          <div className="space-y-6">
            <PostAuthor
              authorId={post.authorId}
              firstName={post.author?.firstName}
              lastName={post.author?.lastName}
              photoURL={post.author?.photoURL}
              createdAt={post.createdAt}
              avatarSize="lg"
            />

            <div className="space-y-4">
              <h2 className="break-all text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                {post.title}
              </h2>
              <p className="break-all text-lg md:text-xl text-foreground/90 wrap-break-word leading-relaxed whitespace-pre-wrap tracking-normal">
                {post.content}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end pt-6 border-t border-muted">
            <PostReactions
              postId={post.id}
              likesCount={post.likesCount}
              dislikesCount={post.dislikesCount}
              userLike={post.userLike}
              onLike={handleLikeClick}
              showComments={false}
            />
          </div>
        </div>

        <div className="lg:col-span-2 border-t lg:border-t-0 lg:border-l lg:pl-8 pt-8 lg:pt-0 h-full min-h-75">
          <h3 className="font-bold text-xl tracking-tight mb-4 text-foreground">
            Comments ({post.commentsCount})
          </h3>
          <div className="rounded-xl border border-dashed border-muted p-8 text-center bg-muted/20">
            <CommentList postId={post.id} />
          </div>
          <CommentInput postId={post.id} className="mt-4" />
        </div>
      </div>
    );
  };

  if (isModal) {
    return (
      <Dialog open={true} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-w-full w-[95vw] sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl overflow-y-auto max-h-[92vh] p-6 md:p-8 rounded-xl gap-0">
          <DialogHeader className="mb-4 text-left">
            <DialogTitle className="text-2xl font-bold tracking-tight">
              Post Thread
            </DialogTitle>
            <DialogDescription className="sr-only">
              Detailed view and community comments for post {id}
            </DialogDescription>
          </DialogHeader>
          <div className="pt-2">{renderContent()}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-2 px-4 md:py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="shadow-md border-muted/80 overflow-hidden rounded-2xl">
        <CardHeader className="pb-6 border-b border-muted bg-muted/5">
          <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight">
            {isLoading
              ? "Loading Post..."
              : !post
                ? "Post Not Found"
                : "Post Thread"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 md:p-8 pt-8">{renderContent()}</CardContent>
      </Card>
    </div>
  );
}
