import type { FuncionarioWorkspaceResumoCard as FuncionarioWorkspaceResumoCardData } from '../types';

export function FuncionarioWorkspaceResumoCard({ card }: { card: FuncionarioWorkspaceResumoCardData }) {
  return (
    <article className="rounded-xl border border-border-default bg-white p-5 shadow-sm shadow-gray-100/60">
      <h3 className="text-base font-semibold text-text-strong">{card.titulo}</h3>
      <p className="mt-1 text-sm text-text-muted">{card.descricao}</p>

      <div className="mt-4 space-y-3">
        {card.itens.map((item) => (
          <div
            key={`${card.id}-${item.label}`}
            className="flex items-center justify-between rounded-lg bg-surface-soft px-3 py-2"
          >
            <span className="text-sm text-text-muted">{item.label}</span>
            <span
              className={
                item.destaque ? 'text-sm font-semibold text-jogab-700' : 'text-sm font-medium text-text-strong'
              }
            >
              {item.valor}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}
