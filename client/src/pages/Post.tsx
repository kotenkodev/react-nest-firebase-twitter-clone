import PostCard from "@/components/post/PostCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Post } from "@/types/post";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

type PostProps = {
  isModal?: boolean;
};

export default function Post({ isModal }: PostProps) {
  const navigate = useNavigate();

  const handleClose = () => navigate(-1);

  const content = (
    <Card>
      <CardHeader>
        <CardTitle>Post Title</CardTitle>
        <CardDescription>Post content goes here...</CardDescription>
      </CardHeader>
      <CardContent>
        <img
          src="https://via.placeholder.com/600x400"
          alt="Post Image"
          className="w-full h-48 object-cover rounded-t-md"
        />
      </CardContent>
    </Card>
  );

  if (isModal) {
    return (
      <Dialog open={true} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Post Details</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
        <DialogDescription></DialogDescription>
      </Dialog>
    );
  }

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-2xl font-bold mb-6">Post</h1>
      <div className="border rounded-lg bg-card">{content}</div>
    </div>
  );
}
