import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import PostForm from "./PostForm";
import { useUIStore } from "@/store/useUIStore";

export default function PostDialog() {
  const { isPostDialogOpen, setPostDialogOpen, editingPost } = useUIStore();

  return (
    <Dialog open={isPostDialogOpen} onOpenChange={setPostDialogOpen}>
      <DialogContent className="max-w-full w-[95vw] sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl overflow-y-auto max-h-[92vh] p-6 md:p-8 rounded-xl gap-0">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold tracking-tight">
            {editingPost ? "Edit Post" : "Create New Post"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {editingPost
              ? "Form for editing an existing post"
              : "Form for creating a new post"}
          </DialogDescription>
        </DialogHeader>
        <PostForm
          post={editingPost}
          onSuccess={() => setPostDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
