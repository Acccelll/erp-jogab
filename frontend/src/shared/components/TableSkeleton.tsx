import { Skeleton } from './Skeleton';

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
  showHeader?: boolean;
}

export function TableSkeleton({ rows = 5, cols = 4, showHeader = true }: TableSkeletonProps) {
  return (
    <div className="w-full space-y-0">
      {showHeader && (
        <div className="flex gap-4 border-b border-border-default/60 px-4 py-2 bg-surface-muted/50">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={`h-${i}`} variant="text" height={16} width={i === 0 ? '40%' : '15%'} />
          ))}
        </div>
      )}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={`r-${r}`} className="flex items-center gap-4 border-b border-border-light px-4 py-3.5">
          <Skeleton variant="circle" height={16} width={16} className="shrink-0" />
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton
              key={`c-${r}-${c}`}
              variant="text"
              height={14}
              width={c === 0 ? '35%' : '12%'}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
