import { useState } from "react";
import { SendIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useCreateComment } from "@/hooks/comments/useCreateComment";
import { toast } from "sonner";
import EmojiPicker from "../ui/emoji-picker";
import { CountedTextarea } from "../CountedTextarea";
import type z from "zod";
import { createCommentSchema } from "@/schemas/comment.schema";
import { useUIStore } from "@/store/useUIStore";

interface CommentInputProps {
  postId: string;
  onSuccess?: () => void;
}

type CommentInput = z.infer<typeof createCommentSchema>;

export default function CommentInput({ postId, onSuccess }: CommentInputProps) {
  const [content, setContent] = useState("");
  const { createComment, isLoading } = useCreateComment();
  const { setReplyingCommentId, replyingCommentId } = useUIStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = createCommentSchema.safeParse(content);
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    createComment(
      {
        postId,
        data: {
          content: result.data.content.trim(),
          parentId,
        },
      },
      {
        onSuccess: () => {
          setContent("");
          toast.success("Comment posted successfully!");
          onSuccess?.();
        },
        onError: () => {
          toast.error("Failed to post comment. Please try again.");
        },
      },
    );
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

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 border-t border-muted/80 bg-background pt-3 pb-1 w-full items-end"
    >
      {replyingCommentId && (
        <>
          <div className="text-sm text-muted-foreground">Replying to:</div>
          <button onClick={() => setReplyingCommentId(null)}>
            <XIcon className="h-4 w-4" />
          </button>
        </>
      )}
      <CountedTextarea
        maxLength={300}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        placeholder={
          replyingCommentId ? "Write a reply..." : "Write a comment..."
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
          disabled={isLoading || !content.trim()}
          className="h-8 w-8 hover:bg-muted/50"
        >
          <SendIcon className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </form>
  );
}
