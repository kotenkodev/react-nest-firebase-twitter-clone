import { useEffect, useState } from "react";
import { SendIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useCreateComment } from "@/hooks/comments/useCreateComment";
import { toast } from "sonner";
import EmojiPicker from "../ui/emoji-picker";
import { CountedTextarea } from "../CountedTextarea";
import type z from "zod";
import { createCommentSchema } from "@/schemas/comment.schema";
import { useUIStore } from "@/store/useUIStore";
import { useEditComment } from "@/hooks/comments/useEditComment";

interface CommentInputProps {
  postId: string;
  onSuccess?: () => void;
}

type CommentInput = z.infer<typeof createCommentSchema>;

export default function CommentInput({ postId, onSuccess }: CommentInputProps) {
  const [content, setContent] = useState("");
  const { replyingComment, editingComment, clearCommentState } = useUIStore();
  const { editComment, isEditing } = useEditComment();
  const { createComment, isCreating } = useCreateComment();

  const isReply = !!replyingComment;
  const isEdit = !!editingComment;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = createCommentSchema.safeParse({ content });
    if (!result.success) {
      toast.error(result.error.message);
      return;
    }

    if (isEdit) {
      editComment(
        {
          postId,
          commentId: editingComment?.id || "",
          data: {
            content: result.data.content.trim(),
          },
        },
        {
          onSuccess: () => {
            setContent("");
            clearCommentState();
            toast.success("Comment updated successfully!");
            onSuccess?.();
          },
          onError: () => {
            toast.error("Failed to update comment. Please try again.");
          },
        },
      );
    } else {
      createComment(
        {
          postId,
          data: {
            content: result.data.content.trim(),
            parentId: replyingComment?.id,
          },
        },
        {
          onSuccess: () => {
            setContent("");
            clearCommentState();
            toast.success("Comment posted successfully!");
            onSuccess?.();
          },
          onError: () => {
            toast.error("Failed to post comment. Please try again.");
          },
        },
      );
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setContent((prev) => prev + emoji);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (replyingComment) {
      setContent("");
    }
  }, [replyingComment]);

  useEffect(() => {
    if (editingComment) {
      setContent(editingComment.content);
    } else {
      setContent("");
    }
  }, [editingComment]);

  return (
    <div className="w-full border-t border-muted/80 bg-background">
      {(isReply || isEdit) && (
        <div className="flex items-center justify-between px-3 py-1.5 bg-muted/40 border-b border-muted/80 text-xs text-muted-foreground transition-all animate-in slide-in-from-top-1 duration-200">
          <span className="font-semibold">
            {isReply
              ? `Replying to ${replyingComment?.author.firstName} ${replyingComment?.author.lastName || ""}`.trim()
              : "Editing comment"}
          </span>
          <button
            type="button"
            onClick={clearCommentState}
            className="p-1 hover:bg-muted/80 rounded-full cursor-pointer transition-colors"
          >
            <XIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 pt-3 pb-1 w-full items-end"
      >
        <CountedTextarea
          maxLength={300}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isCreating || isEditing}
          placeholder={
            isReply
              ? "write a reply..."
              : isEdit
                ? "edit your comment..."
                : "write a comment..."
          }
          rows={1}
          className="flex-1 min-w-0 min-h-[40px] max-h-[120px] rounded-xl border border-muted/85 bg-background px-3 py-2 focus:outline-none focus:ring-1 focus:ring-ring text-sm resize-none overflow-y-auto"
        />
        <div className="flex items-center gap-1 shrink-0 pb-1">
          <EmojiPicker onEmojiSelect={handleEmojiSelect} />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            disabled={isCreating || isEditing || !content.trim()}
            className="h-8 w-8 hover:bg-muted/50"
          >
            <SendIcon className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
