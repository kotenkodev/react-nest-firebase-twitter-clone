import { toast } from "sonner";
import { deletePost } from "@/services/postsService";
import { useUIStore } from "@/store/useUIStore";
import type { Post } from "@/types/post.types";
import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { likePost } from "@/services/likesService";
import { useAuthStore } from "@/store/useAuthStore";
import { PostCardSkeleton } from "./PostCardSkeleton";
import { Loader2Icon, SquarePenIcon } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

type PostListProps = {
  fetchAction: (context: {
    pageParam?: string;
  }) => Promise<{ posts: Post[]; nextCursor?: string | null }>;
  emptyMessage?: string;
};

export default function PostList({
  fetchAction,
  emptyMessage = "No posts found.",
}: PostListProps) {
  const { user } = useAuthStore();
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { setPostDialogOpen, setEditingPost } = useUIStore();

  const { ref, inView } = useInView({ threshold: 0 });
  const queryClient = useQueryClient();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: fetchAction,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  const handleLikeClick = async (postId: string, like: "like" | "dislike") => {
    await queryClient.cancelQueries({ queryKey: ["posts"] });

    const previousData = queryClient.getQueryData(["posts"]);

    queryClient.setQueryData(["posts"], (oldData: any) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page: any) => ({
          ...page,
          posts: page.posts.map((post: Post) => {
            if (post.id !== postId) return post;

            const isSameReaction = post.userLike === like;
            const newReaction = isSameReaction ? null : like;

            return {
              ...post,
              userLike: newReaction,
              likesCount:
                post.likesCount +
                (newReaction === "like" ? 1 : 0) -
                (post.userLike === "like" ? 1 : 0),
              dislikesCount:
                post.dislikesCount +
                (newReaction === "dislike" ? 1 : 0) -
                (post.userLike === "dislike" ? 1 : 0),
            };
          }),
        })),
      };
    });

    try {
      await likePost(postId, { type: like });
    } catch (error) {
      queryClient.setQueryData(["posts"], previousData);
      console.error(`Error handling ${like}:`, error);
      toast.error("Failed to update reaction.");
    }
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

    setIsDeleting(true);
    try {
      await deletePost(postToDelete.id);

      queryClient.setQueryData(["posts"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            posts: page.posts.filter((p: Post) => p.id !== postToDelete.id),
          })),
        };
      });

      toast.success("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post. Please try again.");
    } finally {
      setIsDeleting(false);
      setPostToDelete(null);
    }
  };

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === "pending" || status === "loading") {
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
        {isFetchingNextPage && <Loader2Icon className="animate-spin" />}
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
