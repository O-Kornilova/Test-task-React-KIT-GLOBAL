import clsx from "clsx";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={clsx(
        "bg-paper-warm animate-pulse rounded-sm",
        className
      )}
    />
  );
}

export function PostCardSkeleton() {
  return (
    <div className="card-surface p-6 flex flex-col gap-4" style={{ animationName: "none" }}>
      <div className="flex gap-2">
        <Skeleton className="h-5 w-14" />
        <Skeleton className="h-5 w-10" />
      </div>
      <Skeleton className="h-7 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex items-center gap-3 mt-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

export function PostDetailSkeleton() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <Skeleton className="h-10 w-2/3 mb-4" />
      <div className="flex gap-3 mb-8">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-5 w-20" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full mb-3" />
      ))}
      <Skeleton className="h-4 w-4/5 mb-3" />
    </div>
  );
}
