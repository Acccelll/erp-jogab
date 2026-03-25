import { CheckCheck, History } from 'lucide-react';

export function HorasExtrasAprovacaoPlaceholder() {
  return (
    <section className="grid gap-4 xl:grid-cols-2">
      <article className="rounded-xl border border-border-default bg-white p-5 shadow-sm shadow-gray-100/60">
        <div className="mb-3 flex items-center gap-2 text-jogab-700">
          <CheckCheck size={18} />
          <h3 className="text-base font-semibold text-text-strong">Aprovação</h3>
        </div>
        <p className="text-sm text-text-muted">
          Área preparada para o fluxo futuro de aprovação por gestor, obra e origem do lançamento.
        </p>
        <ul className="mt-4 space-y-2 text-sm text-text-muted">
          <li>• Aprovação em lote por obra e competência.</li>
          <li>• Rejeição com motivo e rastreabilidade.</li>
          <li>• Encaminhamento para fechamento e FOPAG.</li>
        </ul>
      </article>

      <article className="rounded-xl border border-border-default bg-white p-5 shadow-sm shadow-gray-100/60">
        <div className="mb-3 flex items-center gap-2 text-jogab-700">
          <History size={18} />
          <h3 className="text-base font-semibold text-text-strong">Histórico e integração</h3>
        </div>
        <p className="text-sm text-text-muted">
          Placeholder explícito para rastrear eventos do lançamento: aprovação, fechamento, envio para FOPAG e reflexo
          no financeiro.
        </p>
      </article>
    </section>
  );
}
