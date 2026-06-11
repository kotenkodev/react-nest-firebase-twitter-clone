import type { Post } from "@/types/post";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { MessageCircleIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { Badge } from "./ui/badge";

export default function PostCard({ post }: { post: Post }) {
  const likedStyles = "bg-green-100 text-green-800 hover:bg-green-200";
  const dislikedStyles = "bg-red-100 text-red-800 hover:bg-red-200";

  return (
    <Card>
      <img
        src={post.photoURL}
        alt="Post Image"
        className="w-full h-48 object-cover rounded-t-md"
      />
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>{post.content}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-end gap-4">
        <Badge
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm"
          variant="secondary"
        >
          <MessageCircleIcon className="w-5 h-5" />
          {post.commentsCount}
        </Badge>
        <Badge className={likedStyles} variant="secondary">
          <ThumbsUpIcon className="w-5 h-5" />
          {post.likesCount}
        </Badge>
        <Badge className={dislikedStyles} variant="secondary">
          <ThumbsDownIcon className="w-5 h-5" />
          {post.dislikesCount}
        </Badge>
      </CardContent>
    </Card>
  );
}
