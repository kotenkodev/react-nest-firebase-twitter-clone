import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

interface PostSkeletonContentProps {
  hasImage?: boolean;
  className?: string;
  avatarSize?: "sm" | "md" | "lg";
}

export function PostSkeletonContent({
  hasImage = true,
  className,
  avatarSize = "md",
}: PostSkeletonContentProps) {
  const avatarSizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <div className={cn("space-y-6", className)}>
      {hasImage && <Skeleton className="w-full aspect-video rounded-xl" />}

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton
            className={cn("rounded-full shrink-0", avatarSizes[avatarSize])}
          />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <Skeleton className="h-6 w-3/4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}
