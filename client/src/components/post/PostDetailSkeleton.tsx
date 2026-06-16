import { Skeleton } from "../ui/skeleton";
import { PostSkeletonContent } from "./PostSkeletonContent";

export function PostDetailSkeleton() {
  return (
    <div className="grid gap-8 grid-cols-1 lg:grid-cols-5 items-start">
      <div className="lg:col-span-3 space-y-6">
        <PostSkeletonContent avatarSize="lg" />

        <div className="flex items-center gap-3 pt-4 border-t border-muted justify-end">
          <Skeleton className="h-10 w-24 rounded-full" />
          <Skeleton className="h-10 w-24 rounded-full" />
        </div>
      </div>

      <div className="lg:col-span-2 border-t lg:border-t-0 lg:border-l lg:pl-8 pt-8 lg:pt-0 h-full min-h-75 space-y-4">
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-50 w-full rounded-xl" />
      </div>
    </div>
  );
}
