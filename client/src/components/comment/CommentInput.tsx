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
  const { replyingCommentId, editingComment, clearCommentState } = useUIStore();
  const { editComment, isEditing } = useEditComment();
  const { createComment, isCreating } = useCreateComment();

  const isReply = !!replyingCommentId;
  const isEdit = !!editingComment;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = createCommentSchema.safeParse({ content });
    if (!result.success) {
      toast.error(result.error.message);
      console.log(result.error.message);
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
            parentId: replyingCommentId,
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
    if (replyingCommentId) {
      setContent("");
    }
  }, [replyingCommentId]);

  useEffect(() => {
    if (editingComment) {
      setContent(editingComment.content);
    } else {
      setContent("");
    }
  }, [editingComment]);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 border-t border-muted/80 bg-background pt-3 pb-1 w-full items-end"
    >
      {(isReply || isEdit) && (
        <>
          <div className="text-sm text-muted-foreground">
            {isReply ? "Replying to:" : "Editing:"}
          </div>
          <button onClick={() => clearCommentState()}>
            <XIcon className="h-4 w-4" />
          </button>
        </>
      )}
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
        className="flex-1 min-h-[40px] max-h-[120px] rounded-xl border border-muted/85 bg-background px-3 py-2 focus:outline-none focus:ring-1 focus:ring-ring text-sm resize-none overflow-y-auto"
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
  );
}
