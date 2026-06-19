import type { Post } from "@/types/post.types";
import { EditIcon, TrashIcon } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface PostActionsProps {
  post: Post;
  currentUserId?: string;
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
  className?: string;
}

export function PostActions({
  post,
  currentUserId,
  onEdit,
  onDelete,
  className,
}: PostActionsProps) {
  const isOwner = post.authorId === currentUserId;

  if (!isOwner) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        size="icon-sm"
        className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-100 cursor-pointer shadow-none"
        variant="secondary"
        onClick={() => onEdit(post)}
      >
        <EditIcon className="w-4 h-4" />
      </Button>
      <Button
        size="icon-sm"
        className="bg-red-50 text-red-700 hover:bg-red-100 border-red-100 cursor-pointer shadow-none"
        variant="secondary"
        onClick={() => onDelete(post.id)}
      >
        <TrashIcon className="w-4 h-4" />
      </Button>
    </div>
  );
}
