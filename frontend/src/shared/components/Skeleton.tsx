import { cn } from '@/shared/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rect' | 'circle';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  variant = 'rect',
  width,
  height,
  className,
  style,
  ...props
}: SkeletonProps) {
  const variantClasses = {
    text: 'h-4 w-full rounded',
    rect: 'rounded-md',
    circle: 'rounded-full',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-neutral-200 dark:bg-neutral-800',
        variantClasses[variant],
        className
      )}
      style={{
        width: width,
        height: height,
        ...style,
      }}
      {...props}
    />
  );
}
