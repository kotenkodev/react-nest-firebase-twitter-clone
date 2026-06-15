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
          className="p-6" 
          avatarSize="md"
        />
      </CardHeader>

      <CardContent className="flex items-center justify-end gap-4 pt-0 pb-6 pr-6">
        <Skeleton className="h-8 w-16 rounded-full" />
        <Skeleton className="h-8 w-16 rounded-full" />
        <Skeleton className="h-8 w-16 rounded-full" />
      </CardContent>
    </Card>
  );
}
