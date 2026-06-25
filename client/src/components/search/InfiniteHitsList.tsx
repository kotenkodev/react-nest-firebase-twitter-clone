import { useEffect, useState, useMemo } from "react";
import { useInfiniteHits, useInstantSearch } from "react-instantsearch";
import { useInView } from "react-intersection-observer";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import { useToggleLike } from "@/hooks/posts/useToggleLike";
import { useDeletePost } from "@/hooks/posts/useDeletePost";
import { toast } from "sonner";
import ConfirmDeleteDialog from "@/components/post/ConfirmDeleteDialog";
import { PostCardSkeleton } from "@/components/post/PostCardSkeleton";
import { SquarePenIcon } from "lucide-react";
import type { Post } from "@/types/post.types";
import { getLikesByPostIds } from "@/services/likesService";
import type { LikeType } from "@/types/like.types";
import { useQueryClient } from "@tanstack/react-query";
import { postKeys } from "@/lib/queryKeys";
import { PostCardWithLikes } from "./PostCardWithLikes";

export const InfiniteHitsList = () => {
  const { items, isLastPage, showMore } = useInfiniteHits<Post>();
  const { status } = useInstantSearch();
  const { ref, inView } = useInView({ threshold: 0 });

  const { user } = useAuthStore();
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const { setPostDialogOpen, setEditingPost } = useUIStore();
  const { deletePost, isDeleting } = useDeletePost();
  const { toggleLike } = useToggleLike();

  useEffect(() => {
    if (inView && !isLastPage) {
      showMore();
    }
  }, [inView, isLastPage, showMore]);

  const handleLikeClick = async (postId: string, like: LikeType) => {
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

  const queryClient = useQueryClient();
  const isLoading = status === "loading" || status === "stalled";

  useEffect(() => {
    if (items.length === 0) return;

    items.forEach((item) => {
      const queryKey = postKeys.single(item.objectID);
      const existing = queryClient.getQueryData<Post>(queryKey);
      if (!existing) {
        queryClient.setQueryData(queryKey, {
          ...item,
          id: item.objectID,
          userLike: null,
        } as unknown as Post);
      }
    });

    if (!user?.id) return;

    let isMounted = true;
    getLikesByPostIds(items.map((item) => item.objectID))
      .then((likes) => {
        if (!isMounted) return;

        items.forEach((item, index) => {
          const queryKey = postKeys.single(item.objectID);
          const existing = queryClient.getQueryData<Post>(queryKey);

          const like = likes[index];
          const userLike = like ? like.type : null;

          if (existing) {
            queryClient.setQueryData(queryKey, {
              ...existing,
              userLike,
            });
          } else {
            queryClient.setQueryData(queryKey, {
              ...item,
              id: item.objectID,
              userLike,
            } as unknown as Post);
          }
        });
      })
      .catch((error) => {
        console.error("Error loading likes for search hits:", error);
      });

    return () => {
      isMounted = false;
    };
  }, [user?.id, items, queryClient]);

  const posts = useMemo(() => {
    return items.map((item) => {
      const cached = queryClient.getQueryData<Post>(
        postKeys.single(item.objectID),
      );
      return (
        cached ||
        ({
          ...item,
          id: item.objectID,
          userLike: null,
        } as unknown as Post)
      );
    });
  }, [items, queryClient]);

  if (posts.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed rounded-xl bg-muted/20 w-full max-w-2xl mx-auto mt-6">
        <div className="bg-secondary/50 p-4 rounded-full mb-4">
          <SquarePenIcon className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          No posts found.
        </h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm">
          Try a different search query.
        </p>
      </div>
    );
  }

  return (
    <>
      <ul className="flex flex-col space-y-6 md:space-y-8 w-full max-w-2xl mx-auto pb-10">
        {posts.map((post) => {
          return (
            <li
              key={post.id}
              className="list-none w-full animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <PostCardWithLikes
                initialPost={post}
                onLike={handleLikeClick}
                onEdit={openEditDialog}
                onDelete={() => setPostToDelete(post)}
                currentUserId={user?.id}
              />
            </li>
          );
        })}
      </ul>

      <div ref={ref} className="h-10 flex justify-center mt-4">
        {isLoading ? (
          <ul className="flex flex-col space-y-6 md:space-y-8 w-full max-w-2xl mx-auto pb-10">
            {Array.from({ length: 2 }).map((_, index) => (
              <li key={index} className="list-none w-full">
                <PostCardSkeleton />
              </li>
            ))}
          </ul>
        ) : isLastPage ? (
          <p className="text-sm text-muted-foreground text-center">
            You've reached the end of the feed.
          </p>
        ) : null}
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
};
