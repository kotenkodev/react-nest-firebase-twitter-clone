import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/getInitials";
import { Badge } from "@/components/ui/badge";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import TransitionLink from "@/components/TransitionLink";
import { getPost } from "@/services/postsService";
import { PostDetailSkeleton } from "@/components/post/PostDetailSkeleton";
import type { Post } from "@/types/post";
import { BirdSpinner } from "@/components/ui/bird-spinner";
import { buttonVariants } from "@/components/ui/button";
import { likePost } from "@/services/likesService";

dayjs.extend(relativeTime);

type PostProps = {
  isModal?: boolean;
};

export default function Post({ isModal }: PostProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleClose = () => navigate(-1);

  const handleLikeClick = async (like: "like" | "dislike") => {
    if (!post) return;

    const previousPost = { ...post };

    if (!previousPost) return;
    setPost((current) => {
      if (!current) return current;

      const isSameReaction = current.userLike === like;
      const newReaction = isSameReaction ? null : like;
      return {
        ...current,
        userLike: newReaction,
        likesCount:
          current.likesCount +
          (newReaction === "like" ? 1 : 0) -
          (current.userLike === "like" ? 1 : 0),
        dislikesCount:
          current.dislikesCount +
          (newReaction === "dislike" ? 1 : 0) -
          (current.userLike === "dislike" ? 1 : 0),
      };
    });

    try {
      await likePost(post.id, { type: like });
      toast.success(`You ${like}d the post!`);
    } catch (error) {
      setPost((current) => (current ? { ...current, ...previousPost } : null));
      console.error(`Error handling ${like}:`, error);
      toast.error("Failed to update reaction.");
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const data = await getPost(id!);
        console.log("Fetched post data:", data);
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    if (!isModal && post) {
      document.title = `${post?.title} - Post by ${post?.author?.firstName} ${post?.author?.lastName} / Birb`;
    }
  }, [isModal, post]);

  const renderContent = () => {
    if (isLoading) return <PostDetailSkeleton />;

    if (!post) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="relative">
            <h3 className="text-8xl font-black text-muted-foreground/5 absolute -top-8 left-1/2 -translate-x-1/2 select-none">
              404
            </h3>
            <BirdSpinner size={64} label="" className="relative z-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold tracking-tight">
              Post not found
            </h3>
            <p className="text-muted-foreground max-w-75 mx-auto">
              This post might have been deleted or moved to another nest.
            </p>
          </div>
          {!isModal && (
            <TransitionLink
              to="/"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Back to Home
            </TransitionLink>
          )}
        </div>
      );
    }

    return (
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-5 items-start">
        <div className="lg:col-span-3 space-y-6">
          {post.photoURL && (
            <div className="relative w-full flex justify-center overflow-hidden">
              <img
                src={post.photoURL}
                alt="Post media"
                className="max-h-80 w-auto max-w-full object-contain transition-transform duration-300"
              />
            </div>
          )}

          <div className="space-y-4">
            <TransitionLink
              to={`/profile/${post.authorId}`}
              className="flex items-center gap-3 w-fit self-start no-underline group"
            >
              <Avatar className="h-12 w-12 border-2 shadow-sm shrink-0">
                <AvatarImage
                  src={post.author?.photoURL}
                  alt={post.author?.firstName}
                />
                <AvatarFallback className="bg-secondary text-secondary-foreground text-sm font-bold">
                  {getInitials(
                    `${post.author?.firstName} ${post.author?.lastName}`,
                  )}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col justify-center">
                <span className="text-base font-bold tracking-tight text-foreground leading-tight">
                  {post.author?.firstName} {post.author?.lastName}
                </span>
                <span className="text-xs text-muted-foreground mt-0.5">
                  {dayjs(post.createdAt).fromNow()}
                </span>
              </div>
            </TransitionLink>

            <div className="space-y-3 pt-2">
              <h2 className="break-all text-2xl md:text-3xl font-extrabold tracking-tight text-foreground/90 leading-tight">
                {post.title}
              </h2>
              <p className="break-all text-base md:text-lg text-foreground/90 wrap-break-word leading-relaxed whitespace-pre-wrap tracking-normal">
                {post.content}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-muted justify-end">
            <Badge
              onClick={() => handleLikeClick("like")}
              className={
                post.userLike === "like"
                  ? "bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer"
                  : "cursor-pointer"
              }
              variant="secondary"
            >
              <ThumbsUpIcon className="w-4 h-4" />
              <span className="font-semibold">{post.likesCount}</span>
            </Badge>
            <Badge
              onClick={() => handleLikeClick("dislike")}
              className={
                post.userLike === "dislike"
                  ? "bg-red-100 text-red-800 hover:bg-red-200 cursor-pointer"
                  : "cursor-pointer"
              }
              variant="secondary"
            >
              <ThumbsDownIcon className="w-4 h-4" />
              <span className="font-semibold">{post.dislikesCount}</span>
            </Badge>
          </div>
        </div>

        <div className="lg:col-span-2 border-t lg:border-t-0 lg:border-l lg:pl-8 pt-8 lg:pt-0 h-full min-h-75">
          <h3 className="font-bold text-xl tracking-tight mb-4 text-foreground">
            Comments ({post.commentsCount})
          </h3>
          <div className="rounded-xl border border-dashed border-muted p-8 text-center bg-muted/20">
            <p className="text-sm text-muted-foreground italic">
              Comments stream coming soon...
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (isModal) {
    return (
      <Dialog open={true} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-w-full w-[95vw] sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl overflow-y-auto max-h-[92vh] p-6 md:p-8 rounded-xl gap-0">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold tracking-tight">
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
    <div className="container max-w-7xl mx-auto py-2 px-4 md:py-6">
      <Card className="shadow-md border-muted/80 overflow-hidden rounded-xl">
        <CardHeader className="pb-6 border-b border-muted bg-muted/10">
          <CardTitle className="text-3xl font-extrabold tracking-tight">
            {isLoading && "Loading Post..."}
            {post
              ? `Viewing Post by ${post?.author?.firstName} ${post?.author?.lastName}`
              : "Post Not Found"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 md:p-8 pt-8">{renderContent()}</CardContent>
      </Card>
    </div>
  );
}
