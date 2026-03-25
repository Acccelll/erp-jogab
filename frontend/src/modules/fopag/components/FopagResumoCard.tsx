import type { FopagResumoCard } from '../types';

interface FopagResumoCardProps {
  card: FopagResumoCard;
}

export function FopagResumoCard({ card }: FopagResumoCardProps) {
  return (
    <article className="rounded-xl border border-border-default bg-white p-5 shadow-sm shadow-gray-100/60">
      <h3 className="text-base font-semibold text-text-strong">{card.titulo}</h3>
      <p className="mt-1 text-sm text-text-muted">{card.descricao}</p>
      <dl className="mt-4 space-y-3">
        {card.itens.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between gap-4 rounded-lg bg-surface-soft px-3 py-2.5"
          >
            <dt className="text-sm text-text-muted">{item.label}</dt>
            <dd
              className={
                item.destaque ? 'text-sm font-semibold text-jogab-700' : 'text-sm font-semibold text-text-body'
              }
            >
              {item.valor}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
