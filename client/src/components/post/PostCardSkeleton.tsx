import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { PostSkeletonContent } from "./PostSkeletonContent";

interface PostCardSkeletonProps {
  hasImage?: boolean;
}

export function PostCardSkeleton({ hasImage = true }: PostCardSkeletonProps) {
  return (
    <Card className="p-0 overflow-hidden">
      <CardHeader className="p-0">
        <PostSkeletonContent
          hasImage={hasImage}
          className="p-4"
          avatarSize="sm"
        />
      </CardHeader>

      <CardContent className="flex items-center justify-end gap-2 pt-0 pb-4 pr-4">
        <Skeleton className="h-7 w-14 rounded-full" />
        <Skeleton className="h-7 w-14 rounded-full" />
        <Skeleton className="h-7 w-14 rounded-full" />
      </CardContent>
    </Card>
  );
}
