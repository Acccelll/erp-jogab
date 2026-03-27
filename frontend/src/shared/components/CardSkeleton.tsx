import { Skeleton } from './Skeleton';

interface CardSkeletonProps {
  rows?: number;
}

export function CardSkeleton({ rows = 3 }: CardSkeletonProps) {
  return (
    <div className="rounded-lg border border-border-default bg-surface p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-4">
        <Skeleton variant="circle" height={40} width={40} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" height={12} />
        </div>
      </div>
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex justify-between gap-4 border-t border-border-light pt-4 first:border-0 first:pt-0">
            <Skeleton variant="text" width="30%" height={14} />
            <Skeleton variant="text" width="20%" height={14} />
          </div>
        ))}
      </div>
    </div>
  );
}
