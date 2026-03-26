import { Suspense } from 'react';

function LoadingSpinner() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
    </div>
  );
}

/** Wraps lazy-loaded route elements with a Suspense boundary. */
export function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
}
