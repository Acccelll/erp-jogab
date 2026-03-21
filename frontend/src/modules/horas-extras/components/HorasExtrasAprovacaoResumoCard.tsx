import type { HoraExtraAprovacaoResumoCard } from '../types';

export function HorasExtrasAprovacaoResumoCard({ card }: { card: HoraExtraAprovacaoResumoCard }) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
      <h3 className="text-base font-semibold text-gray-900">{card.titulo}</h3>
      <p className="mt-1 text-sm text-gray-500">{card.descricao}</p>
      <div className="mt-4 space-y-3">
        {card.itens.map((item) => (
          <div key={`${card.id}-${item.label}`} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
            <span className="text-sm text-gray-600">{item.label}</span>
            <span className={item.destaque ? 'text-sm font-semibold text-jogab-700' : 'text-sm font-medium text-gray-900'}>{item.valor}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
