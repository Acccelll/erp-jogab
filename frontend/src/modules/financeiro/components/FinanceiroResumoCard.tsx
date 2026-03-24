import type { FinanceiroResumoCardData } from '../types';

interface FinanceiroResumoCardProps {
  card: FinanceiroResumoCardData;
}

export function FinanceiroResumoCard({ card }: FinanceiroResumoCardProps) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900">{card.titulo}</h3>
        <p className="mt-1 text-sm text-gray-500">{card.descricao}</p>
      </div>

      <div className="space-y-3">
        {(card.itens ?? []).map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 px-3 py-2">
            <span className="text-sm text-gray-600">{item.label}</span>
            <span
              className={item.destaque ? 'text-sm font-semibold text-jogab-700' : 'text-sm font-medium text-gray-900'}
            >
              {item.valor}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}
