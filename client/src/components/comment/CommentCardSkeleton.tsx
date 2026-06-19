import { Skeleton } from "../ui/skeleton";

export default function CommentCardSkeleton() {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl border border-muted/40 bg-card/50 transition-all">
      <Skeleton className="h-8 w-8 rounded-full shrink-0" />

      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <Skeleton className="h-4 w-24 rounded-lg" />
            <Skeleton className="h-3 w-12 rounded-lg" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 mt-1">
          <Skeleton className="h-3.5 w-full rounded-lg" />
          <Skeleton className="h-3.5 w-[80%] rounded-lg" />
        </div>

        <div className="flex items-center justify-between gap-1.5 mt-1.5">
          <Skeleton className="h-3.5 w-20 rounded-lg" />
          <Skeleton className="h-3.5 w-16 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
