import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { ReactNode } from 'react';

interface DashboardSectionGroupProps {
  title: string;
  description?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  /** Controlled open state — when provided, overrides internal state */
  isOpen?: boolean;
  /** Called when the user toggles the section — required when isOpen is provided */
  onToggle?: (open: boolean) => void;
}

export function DashboardSectionGroup({
  title,
  children,
  defaultOpen = true,
  isOpen: controlledOpen,
  onToggle,
}: DashboardSectionGroupProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  // Warn in development if the component switches between controlled and uncontrolled modes
  const initiallyControlled = useRef(isControlled);
  useEffect(() => {
    if (import.meta.env.DEV && initiallyControlled.current !== isControlled) {
      console.warn(
        '[DashboardSectionGroup] Component switched between controlled and uncontrolled mode. ' +
          'Decide on one mode and keep it consistent throughout the component lifecycle.',
      );
    }
  }, [isControlled]);

  const handleToggle = useCallback(() => {
    const next = !open;
    if (isControlled) {
      onToggle?.(next);
    } else {
      setInternalOpen(next);
    }
  }, [open, isControlled, onToggle]);

  return (
    <section>
      <button type="button" onClick={handleToggle} className="mb-2 flex w-full items-center gap-2 text-left">
        <ChevronDown
          size={14}
          className={cn('shrink-0 text-text-subtle transition-transform', !open && '-rotate-90')}
        />
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-subtle">{title}</h2>
        <div className="h-px flex-1 bg-border-light" />
      </button>
      {open && <div className="grid gap-3 xl:grid-cols-2">{children}</div>}
    </section>
  );
}
