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
                ? 'border-gray-300 bg-white font-medium text-gray-900'
                : 'border-gray-200/60 bg-white text-gray-500 hover:bg-gray-50',
            )}
          >
            {chip.label}
            {chip.count != null && <span className="ml-1.5 text-xs font-normal text-gray-400">{chip.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
