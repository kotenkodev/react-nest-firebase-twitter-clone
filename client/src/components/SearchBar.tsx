import { useEffect, useState } from "react";
import { algoliasearch } from "algoliasearch";
import {
  InstantSearch,
  Configure,
  useInfiniteHits,
  useInstantSearch,
  useSearchBox,
} from "react-instantsearch";
import { useInView } from "react-intersection-observer";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import { useToggleLike } from "@/hooks/posts/useToggleLike";
import { useDeletePost } from "@/hooks/posts/useDeletePost";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import PostCard from "@/components/post/PostCard";
import ConfirmDeleteDialog from "@/components/post/ConfirmDeleteDialog";
import { PostCardSkeleton } from "@/components/post/PostCardSkeleton";
import { SquarePenIcon, Search } from "lucide-react";
import type { Post } from "@/types/post.types";

const algoliaAppId = import.meta.env.VITE_ALGOLIA_APP_ID;
const algoliaSearchKey = import.meta.env.VITE_ALGOLIA_SEARCH_KEY;
const indexName = "PostsSearch";

const searchClient = algoliasearch(algoliaAppId, algoliaSearchKey);

const InfiniteHitsList = () => {
  const { items, isLastPage, showMore } = useInfiniteHits();
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

    deletePost(postToDelete.id || (postToDelete as any).objectID, {
      onSuccess: () => toast.success("Post deleted successfully!"),
      onError: () => toast.error("Failed to delete post. Please try again."),
    });

    setPostToDelete(null);
  };

  const isLoading = status === "loading" || status === "stalled";

  if (items.length === 0 && !isLoading) {
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
        {items.map((hit: any) => {
          const post = {
            ...hit,
            id: hit.objectID,
          };

          return (
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

const DebouncedSearchBox = (props: any) => {
  const { query, refine } = useSearchBox(props);
  const [inputValue, setInputValue] = useState(query);
  const debouncedInputValue = useDebounce(inputValue, 700);

  useEffect(() => {
    refine(debouncedInputValue);
  }, [debouncedInputValue, refine]);

  return (
    <div className="flex rounded-full bg-muted px-4 py-2 border border-transparent transition-all items-center focus-within:bg-background focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20">
      <Search className="w-5 h-5 text-muted-foreground mr-2 shrink-0" />
      <input
        type="search"
        value={inputValue}
        onChange={(event) => setInputValue(event.currentTarget.value)}
        placeholder="Search Birb..."
        autoFocus
        className="bg-transparent border-none grow outline-none text-foreground w-full"
      />
    </div>
  );
};

export default function SearchBar() {
  return (
    <div className="w-full">
      <InstantSearch
        indexName={indexName}
        searchClient={searchClient}
        routing={true}
      >
        <Configure
          hitsPerPage={10}
          attributesToHighlight={["title", "text", "content", "author"]}
        />

        <div className="max-w-2xl mx-auto mb-6 sticky top-[73px] z-10 bg-background/95 backdrop-blur-sm py-2">
          <DebouncedSearchBox />
        </div>

        <InfiniteHitsList />
      </InstantSearch>
    </div>
  );
}
