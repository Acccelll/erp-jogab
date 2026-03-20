import type { LucideIcon } from 'lucide-react';
import { Construction } from 'lucide-react';

interface ObraTabPlaceholderProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

/** Placeholder for obra workspace sub-tabs */
export function ObraTabPlaceholder({ icon: Icon, title, description }: ObraTabPlaceholderProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
        <Icon size={28} />
      </div>
      <div className="text-center">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 max-w-xs text-sm text-gray-500">{description}</p>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <Construction size={12} />
        <span>Em desenvolvimento — Fase 3+</span>
      </div>
    </div>
  );
}
