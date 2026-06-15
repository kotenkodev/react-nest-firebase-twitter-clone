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

  const likedStyles =
    "bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer select-none transition-colors";
  const dislikedStyles =
    "bg-red-100 text-red-800 hover:bg-red-200 cursor-pointer select-none transition-colors";

  function handleReactionClick(reaction: "like" | "dislike") {
    try {
      toast.success(`You ${reaction}d the post!`);
    } catch (error) {
      console.error(`Error handling ${reaction}:`, error);
    }
  }

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const data = await getPost(id!);

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
    if (!post) return <p>Post not found.</p>;

    return (
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-5 items-start">
        <div className="lg:col-span-3 space-y-6">
          {post.photoURL && (
            <div className="relative w-full flex justify-center overflow-hidden">
              <img
                src={post.photoURL}
                alt="Post media"
                className="max-h-80 w-auto max-w-full object-contain transition-transform duration-300 hover:scale-[1.02]"
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
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground/90 leading-tight">
                {post.title}
              </h2>
              <p className="text-base md:text-lg text-foreground/90 wrap-break-word leading-relaxed whitespace-pre-wrap tracking-normal">
                {post.content}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-muted justify-end">
            <Badge
              onClick={() => handleReactionClick("like")}
              className={`${likedStyles} flex items-center gap-1.5 px-4 py-2 text-sm rounded-full shadow-sm`}
              variant="secondary"
            >
              <ThumbsUpIcon className="w-4 h-4" />
              <span className="font-semibold">{post.likesCount}</span>
            </Badge>
            <Badge
              onClick={() => handleReactionClick("dislike")}
              className={`${dislikedStyles} flex items-center gap-1.5 px-4 py-2 text-sm rounded-full shadow-sm`}
              variant="secondary"
            >
              <ThumbsDownIcon className="w-4 h-4" />
              <span className="font-semibold">{post.dislikesCount}</span>
            </Badge>
          </div>
        </div>

        <div className="lg:col-span-2 border-t lg:border-t-0 lg:border-l lg:pl-8 pt-8 lg:pt-0 h-full min-h-[300px]">
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
            {isLoading
              ? "Loading Post..."
              : `Viewing Post by ${post?.author?.firstName} ${post?.author?.lastName}`}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 md:p-8 pt-8">{renderContent()}</CardContent>
      </Card>
    </div>
  );
}
