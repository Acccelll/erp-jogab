import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FISCAL_INTEGRACAO_STATUS_LABELS } from '../types';
import type { FiscalVinculos } from '../types';

export function FiscalVinculosBloco({ vinculos }: { vinculos: FiscalVinculos }) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
      <h2 className="text-base font-semibold text-gray-900">Vínculos operacionais</h2>
      <div className="mt-4 space-y-4 text-sm text-gray-600">
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
          <p className="text-xs uppercase tracking-wide text-gray-400">Compra</p>
          {vinculos.compraCodigo ? (
            <div className="mt-1 flex items-center justify-between gap-3">
              <span className="font-medium text-gray-900">{vinculos.compraCodigo}</span>
              {vinculos.pedidoCompraHref ? (
                <Link to={vinculos.pedidoCompraHref} className="inline-flex items-center gap-1 text-xs font-medium text-jogab-600 hover:text-jogab-700">
                  Abrir pedido
                  <ExternalLink size={12} />
                </Link>
              ) : null}
            </div>
          ) : (
            <p className="mt-1">Sem pedido de compra vinculado.</p>
          )}
        </div>

        <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
          <p className="text-xs uppercase tracking-wide text-gray-400">Obra</p>
          <p className="mt-1 font-medium text-gray-900">{vinculos.obraNome ?? 'Sem obra vinculada'}</p>
        </div>

        <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
          <p className="text-xs uppercase tracking-wide text-gray-400">Estoque</p>
          <p className="mt-1 font-medium text-gray-900">{FISCAL_INTEGRACAO_STATUS_LABELS[vinculos.estoqueStatus]}</p>
          {vinculos.estoqueMovimentacaoResumo ? <p className="mt-1">{vinculos.estoqueMovimentacaoResumo}</p> : null}
        </div>

        <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
          <p className="text-xs uppercase tracking-wide text-gray-400">Financeiro</p>
          <p className="mt-1 font-medium text-gray-900">{FISCAL_INTEGRACAO_STATUS_LABELS[vinculos.financeiroStatus]}</p>
          {vinculos.tituloFinanceiroCodigo ? (
            <div className="mt-2 flex items-center justify-between gap-3">
              <span>{vinculos.tituloFinanceiroCodigo}</span>
              {vinculos.tituloFinanceiroHref ? (
                <Link to={vinculos.tituloFinanceiroHref} className="inline-flex items-center gap-1 text-xs font-medium text-jogab-600 hover:text-jogab-700">
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
