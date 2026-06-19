import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
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
import { VisuallyHidden } from "radix-ui";

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
      <div className="flex flex-col h-full overflow-hidden">
        <div className="mb-3 text-left shrink-0 border-b pb-2">
          <div className="flex items-center justify-between w-full pr-10">
            <div className="flex flex-col lg:flex-row lg:items-center gap-2 min-w-0 flex-1 lg:max-w-[60%] mr-4">
              <PostAuthor
                authorId={post.authorId}
                firstName={post.author?.firstName}
                lastName={post.author?.lastName}
                photoURL={post.author?.photoURL}
                createdAt={post.createdAt}
                avatarSize="sm"
                className="shrink-0"
              />
              <h2 className="text-base md:text-lg font-extrabold leading-tight tracking-tight lg:border-l lg:pl-4 border-muted flex-1 min-w-0 break-words">
                {post.title}
              </h2>
            </div>
            <h3 className="font-bold text-base md:text-lg tracking-tight text-foreground shrink-0 hidden lg:block">
              Comments ({post.commentsCount})
            </h3>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-5 items-stretch flex-1 overflow-hidden">
          <div className="lg:col-span-3 flex flex-col h-full overflow-hidden">
            <div className="flex-1 space-y-2 overflow-y-auto pr-2">
              {post.photoURL && (
                <div className="relative w-full flex justify-center overflow-hidden rounded-xl border bg-muted/20">
                  <img
                    src={post.photoURL}
                    alt="Post media"
                    className="max-h-[500px] w-auto max-w-full object-contain transition-transform duration-300"
                  />
                </div>
              )}

              <p className="text-lg text-foreground/90 leading-relaxed whitespace-pre-wrap break-words">
                {post.content}
              </p>
            </div>

            <div className="flex items-center justify-end pt-2 mt-2 border-t border-muted shrink-0 bg-background/95 backdrop-blur">
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

          <div className="lg:col-span-2 flex flex-col border-t lg:border-t-0 lg:border-l lg:pl-4 pt-4 lg:pt-0 h-full overflow-hidden">
            <h3 className="font-bold text-lg tracking-tight mb-2 text-foreground shrink-0 block lg:hidden">
              Comments ({post.commentsCount})
            </h3>

            <div className="flex-1 flex flex-col gap-2 overflow-hidden">
              <div className="flex-1 overflow-y-auto pr-1">
                <CommentList postId={post.id} />
              </div>
              <div className="pt-2 sticky bottom-0 bg-background/95 backdrop-blur shrink-0 w-full">
                <CommentInput postId={post.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const pageContent = (
    <div className="flex flex-col h-full overflow-hidden p-4 md:p-5">
      <div className="flex-1 overflow-hidden">{renderContent()}</div>
    </div>
  );

  if (isModal) {
    return (
      <Dialog open={true} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-w-full w-[95vw] sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl h-[90vh] max-h-[90vh] flex flex-col overflow-hidden p-0 rounded-xl gap-0">
          <DialogTitle>{post?.title}</DialogTitle>
          <DialogDescription className="sr-only">
            Post content and comments.
          </DialogDescription>
          {pageContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-1 px-2 md:py-3 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-100px)]">
      <Card className="shadow-md border-muted/80 overflow-hidden rounded-2xl h-full flex flex-col">
        {pageContent}
      </Card>
    </div>
  );
}
