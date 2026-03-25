import type { DocumentosStatusResumo, DocumentosVencimentoResumo } from '../types';

interface DocumentosOverviewProps {
  statusItems: DocumentosStatusResumo[];
  vencimentoItems: DocumentosVencimentoResumo[];
}

export function DocumentosOverview({ statusItems, vencimentoItems }: DocumentosOverviewProps) {
  return (
    <section className="grid gap-4 xl:grid-cols-2">
      <div className="rounded-xl border border-border-default bg-white p-5 shadow-sm shadow-gray-100/60">
        <h3 className="text-base font-semibold text-text-strong">Visão por status</h3>
        <div className="mt-4 space-y-3">
          {statusItems.map((item) => (
            <div key={item.status} className="rounded-lg border border-border-light bg-surface-soft px-3 py-2">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-text-body">{item.label}</p>
                <span className="text-sm text-text-muted">{item.quantidade} documento(s)</span>
              </div>
              <p className="mt-1 text-sm text-text-muted">{item.descricao}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border-default bg-white p-5 shadow-sm shadow-gray-100/60">
        <h3 className="text-base font-semibold text-text-strong">Visão por vencimento</h3>
        <div className="mt-4 space-y-3">
          {vencimentoItems.map((item) => (
            <div key={item.alerta} className="rounded-lg border border-border-light bg-surface-soft px-3 py-2">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-text-body">{item.label}</p>
                <span className="text-sm text-text-muted">{item.quantidade} documento(s)</span>
              </div>
              <p className="mt-1 text-sm text-text-muted">{item.descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
