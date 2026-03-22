import { cn } from '@/shared/lib/utils';
import type { DocumentosResumoCardData } from '../types';

interface DocumentosResumoCardProps {
  card: DocumentosResumoCardData;
}

export function DocumentosResumoCard({ card }: DocumentosResumoCardProps) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-gray-900">{card.titulo}</h3>
        <p className="text-sm text-gray-500">{card.descricao}</p>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {card.itens.map((item) => (
          <div key={item.label} className={cn('rounded-lg border border-gray-100 bg-gray-50 px-3 py-2', item.destaque && 'border-jogab-200 bg-jogab-50')}>
            <p className="text-xs uppercase tracking-wide text-gray-400">{item.label}</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{item.valor}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
