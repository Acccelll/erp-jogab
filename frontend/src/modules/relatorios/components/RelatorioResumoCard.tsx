import type { RelatorioResumoCardData } from '../types';

interface RelatorioResumoCardProps {
  card: RelatorioResumoCardData;
}

export function RelatorioResumoCard({ card }: RelatorioResumoCardProps) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
      <h3 className="text-base font-semibold text-gray-900">{card.titulo}</h3>
      <p className="mt-1 text-sm text-gray-500">{card.descricao}</p>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {card.itens.map((item) => (
          <div key={item.label} className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs uppercase tracking-wide text-gray-400">{item.label}</p>
            <p className={`mt-1 text-lg font-semibold ${item.destaque ? 'text-jogab-700' : 'text-gray-900'}`}>
              {item.valor}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}
