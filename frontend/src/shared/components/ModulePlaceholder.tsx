import type { LucideIcon } from 'lucide-react';
import { Construction } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface ModulePlaceholderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  phase?: string;
}

/** Placeholder visual consistente para módulos ainda não implementados */
export function ModulePlaceholder({
  icon: Icon,
  title,
  description,
  features,
  phase = 'Fase 3+',
}: ModulePlaceholderProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-12">
      {/* Icon */}
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-jogab-50 text-jogab-500">
        <Icon size={40} />
      </div>

      {/* Title + Badge */}
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-xl font-semibold text-text-strong">{title}</h2>
        <StatusBadge label={`Previsto para ${phase}`} variant="info" />
      </div>

      {/* Description */}
      <p className="max-w-md text-center text-sm text-text-muted">{description}</p>

      {/* Feature list */}
      <div className="w-full max-w-sm rounded-lg border border-border-default bg-white p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-subtle">
          Funcionalidades previstas
        </p>
        <ul className="space-y-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-text-muted">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-jogab-300" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Development note */}
      <div className="flex items-center gap-2 text-xs text-text-subtle">
        <Construction size={14} />
        <span>Módulo em desenvolvimento</span>
      </div>
    </div>
  );
}
