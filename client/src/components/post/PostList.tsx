import { toast } from "sonner";
import { deletePost } from "@/services/postsService";
import { useUIStore } from "@/store/useUIStore";
import type { Post } from "@/types/post";
import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { likePost } from "@/services/likesService";
import { useAuthStore } from "@/store/useAuthStore";
import { PostCardSkeleton } from "./PostCardSkeleton";
import { SquarePenIcon, Trash2Icon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

type PostListProps = {
  fetchAction: () => Promise<Post[]>;
  emptyMessage?: string;
};

export default function PostList({
  fetchAction,
  emptyMessage = "No posts found.",
}: PostListProps) {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { setPostDialogOpen, setEditingPost } = useUIStore();

  const handleLikeClick = async (postId: string, like: "like" | "dislike") => {
    const previousPost = posts.find((p) => p.id === postId);

    if (!previousPost) return;
    setPosts((current) =>
      current.map((post) => {
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
    );

    try {
      await likePost(postId, { type: like });
      toast.success(`You ${like}d the post!`);
    } catch (error) {
      setPosts((current) =>
        current.map((post) => (post.id === postId ? previousPost : post)),
      );
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
      setPosts((current) => current.filter((p) => p.id !== postToDelete.id));
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
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAction();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Failed to load posts. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [fetchAction]);

  if (isLoading) {
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

  if (posts.length === 0) {
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

      <AlertDialog
        open={Boolean(postToDelete)}
        onOpenChange={(open) => !open && setPostToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-4 mb-2">
              <div className="bg-destructive/10 p-2.5 rounded-full">
                <Trash2Icon className="w-5 h-5 text-destructive" />
              </div>
              <AlertDialogTitle>Delete Post?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base">
              This action cannot be undone. This will permanently delete your
              post "<span className="font-semibold text-foreground">{postToDelete?.title}</span>" 
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-2">
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteConfirm();
              }}
              variant="destructive"
              className="px-6"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Post"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
