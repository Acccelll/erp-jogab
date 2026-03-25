import { cn } from '@/shared/lib/utils';

export interface QuickFilterChip {
  label: string;
  count?: number;
  value: string | null;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

interface QuickFilterChipsProps {
  chips: QuickFilterChip[];
  value: string | null;
  onChange: (value: string | null) => void;
}

export function QuickFilterChips({ chips, value, onChange }: QuickFilterChipsProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {chips.map((chip) => {
        const isActive = value === chip.value;
        return (
          <button
            key={chip.value ?? '__all'}
            type="button"
            onClick={() => onChange(chip.value)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-sm transition-colors',
              isActive
                ? 'border-jogab-700 bg-jogab-700 font-medium text-white'
                : 'border-border-default bg-surface text-text-muted hover:bg-surface-soft hover:text-text-body',
            )}
          >
            {chip.label}
            {chip.count != null && (
              <span className={cn('ml-1.5 text-xs font-normal', isActive ? 'text-jogab-100' : 'text-text-subtle')}>
                {chip.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
