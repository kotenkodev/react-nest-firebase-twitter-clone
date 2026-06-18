import { toast } from "sonner";
import { useUIStore } from "@/store/useUIStore";
import type { Post } from "@/types/post.types";
import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { useAuthStore } from "@/store/useAuthStore";
import { PostCardSkeleton } from "./PostCardSkeleton";
import { SquarePenIcon } from "lucide-react";
import { useInView } from "react-intersection-observer";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import { useToggleLike } from "@/hooks/posts/useToggleLike";
import { useDeletePost } from "@/hooks/posts/useDeletePost";
import { usePosts } from "@/hooks/posts/usePosts";

type PostListProps = {
  userId?: string;
  search?: string;
  sortBy?: "newest" | "popular";
  emptyMessage?: string;
};

export default function PostList({
  userId,
  search,
  sortBy,
  emptyMessage = "No posts found.",
}: PostListProps) {
  const { user } = useAuthStore();
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const { setPostDialogOpen, setEditingPost } = useUIStore();

  const { deletePost, isDeleting } = useDeletePost();
  const { ref, inView } = useInView({ threshold: 0 });
  const { toggleLike } = useToggleLike();

  const {
    posts,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = usePosts({ userId, search, sortBy });

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

  const openEditDialog = (post: Post) => {
    try {
      setEditingPost(post);
      setPostDialogOpen(true);
    } catch (error) {
      console.error("Error opening edit dialog:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;

    deletePost(postToDelete.id, {
      onSuccess: () => toast.success("Post deleted successfully!"),
      onError: () => toast.error("Failed to delete post. Please try again."),
    });

    setPostToDelete(null);
  };

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === "pending") {
    return (
      <ul className="flex flex-col space-y-6 md:space-y-8 w-full max-w-2xl mx-auto pb-10">
        {Array.from({ length: 3 }).map((_, index) => (
          <li key={index} className="list-none w-full">
            <PostCardSkeleton />
          </li>
        ))}
      </ul>
    );
  }

  if (status === "success" && posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed rounded-xl bg-muted/20">
        <div className="bg-secondary/50 p-4 rounded-full mb-4">
          <SquarePenIcon className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          {emptyMessage}
        </h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm">
          Check back later to see new updates.
        </p>
      </div>
    );
  }

  return (
    <>
      <ul className="flex flex-col space-y-6 md:space-y-8 w-full max-w-2xl mx-auto pb-10">
        {posts.map((post) => (
          <li
            key={post.id}
            className="list-none w-full animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <PostCard
              post={post}
              onLike={handleLikeClick}
              onEdit={openEditDialog}
              onDelete={() => setPostToDelete(post)}
              userLike={post.userLike}
              currentUserId={user?.id}
            />
          </li>
        ))}
      </ul>

      <div ref={ref} className="h-10 flex justify-center mt-4">
        {isFetchingNextPage ? (
          <ul className="flex flex-col space-y-6 md:space-y-8 w-full max-w-2xl mx-auto pb-10">
            {Array.from({ length: 2 }).map((_, index) => (
              <li key={index} className="list-none w-full">
                <PostCardSkeleton />
              </li>
            ))}
          </ul>
        ) : hasNextPage ? null : (
          <p className="text-sm text-muted-foreground text-center">
            You've reached the end of the feed.
          </p>
        )}
      </div>

      <ConfirmDeleteDialog
        isOpen={Boolean(postToDelete)}
        onClose={() => setPostToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="Delete Post?"
        itemName={postToDelete?.title}
        itemType="post"
      />
    </>
  );
}
