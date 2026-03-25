import { cn } from '@/shared/lib/utils';
import type { EstoqueResumoCardData } from '../types';

interface EstoqueResumoCardProps {
  card: EstoqueResumoCardData;
}

export function EstoqueResumoCard({ card }: EstoqueResumoCardProps) {
  return (
    <article className="rounded-xl border border-border-default bg-white p-5 shadow-sm shadow-gray-100/60">
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-text-strong">{card.titulo}</h3>
        <p className="text-sm text-text-muted">{card.descricao}</p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {card.itens.map((item) => (
          <div
            key={item.label}
            className={cn(
              'rounded-lg border border-border-light bg-surface-soft px-3 py-2',
              item.destaque && 'border-jogab-200 bg-jogab-50',
            )}
          >
            <p className="text-xs uppercase tracking-wide text-text-subtle">{item.label}</p>
            <p className="mt-1 text-sm font-semibold text-text-strong">{item.valor}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
