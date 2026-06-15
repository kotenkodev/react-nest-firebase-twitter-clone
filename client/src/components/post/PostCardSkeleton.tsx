import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";

interface PostCardSkeletonProps {
  hasImage?: boolean;
}
export function PostCardSkeleton({ hasImage = true }: PostCardSkeletonProps) {
  return (
    <Card className="p-0 overflow-hidden">
      {hasImage && <Skeleton className="w-full h-64 rounded-none" />}

      <CardHeader>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />

          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        <CardTitle>
          <Skeleton className="h-6 w-3/4" />
        </CardTitle>

        <CardDescription className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardDescription>
      </CardHeader>

      <CardContent className="flex items-center justify-end gap-4 pt-0 pb-4">
        <Skeleton className="h-6 w-12 rounded-full" />
        <Skeleton className="h-6 w-12 rounded-full" />
        <Skeleton className="h-6 w-12 rounded-full" />
      </CardContent>
    </Card>
  );
}
