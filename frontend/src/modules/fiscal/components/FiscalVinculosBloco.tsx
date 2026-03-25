import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FISCAL_INTEGRACAO_STATUS_LABELS } from '../types';
import type { FiscalVinculos } from '../types';

export function FiscalVinculosBloco({ vinculos }: { vinculos: FiscalVinculos }) {
  return (
    <article className="rounded-xl border border-border-default bg-white p-5 shadow-sm shadow-gray-100/60">
      <h2 className="text-base font-semibold text-text-strong">Vínculos operacionais</h2>
      <div className="mt-4 space-y-4 text-sm text-text-muted">
        <div className="rounded-lg border border-border-light bg-surface-soft p-3">
          <p className="text-xs uppercase tracking-wide text-text-subtle">Compra</p>
          {vinculos.compraCodigo ? (
            <div className="mt-1 flex items-center justify-between gap-3">
              <span className="font-medium text-text-strong">{vinculos.compraCodigo}</span>
              {vinculos.pedidoCompraHref ? (
                <Link
                  to={vinculos.pedidoCompraHref}
                  className="inline-flex items-center gap-1 text-xs font-medium text-jogab-700 hover:text-jogab-700"
                >
                  Abrir pedido
                  <ExternalLink size={12} />
                </Link>
              ) : null}
            </div>
          ) : (
            <p className="mt-1">Sem pedido de compra vinculado.</p>
          )}
        </div>

        <div className="rounded-lg border border-border-light bg-surface-soft p-3">
          <p className="text-xs uppercase tracking-wide text-text-subtle">Obra</p>
          <p className="mt-1 font-medium text-text-strong">{vinculos.obraNome ?? 'Sem obra vinculada'}</p>
        </div>

        <div className="rounded-lg border border-border-light bg-surface-soft p-3">
          <p className="text-xs uppercase tracking-wide text-text-subtle">Estoque</p>
          <p className="mt-1 font-medium text-text-strong">{FISCAL_INTEGRACAO_STATUS_LABELS[vinculos.estoqueStatus]}</p>
          {vinculos.estoqueMovimentacaoResumo ? <p className="mt-1">{vinculos.estoqueMovimentacaoResumo}</p> : null}
        </div>

        <div className="rounded-lg border border-border-light bg-surface-soft p-3">
          <p className="text-xs uppercase tracking-wide text-text-subtle">Financeiro</p>
          <p className="mt-1 font-medium text-text-strong">
            {FISCAL_INTEGRACAO_STATUS_LABELS[vinculos.financeiroStatus]}
          </p>
          {vinculos.tituloFinanceiroCodigo ? (
            <div className="mt-2 flex items-center justify-between gap-3">
              <span>{vinculos.tituloFinanceiroCodigo}</span>
              {vinculos.tituloFinanceiroHref ? (
                <Link
                  to={vinculos.tituloFinanceiroHref}
                  className="inline-flex items-center gap-1 text-xs font-medium text-jogab-700 hover:text-jogab-700"
                >
                  Abrir título
                  <ExternalLink size={12} />
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
