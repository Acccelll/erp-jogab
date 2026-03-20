import { formatCurrency } from '@/shared/lib/utils';
import { FinanceiroStatusBadge } from './FinanceiroStatusBadge';
import { FINANCEIRO_TIPO_LABELS } from '../types';
import type { FinanceiroStatusResumo, FinanceiroTipoResumo } from '../types';

interface FinanceiroVisaoStatusTipoProps {
  statusItems: FinanceiroStatusResumo[];
  tipoItems: FinanceiroTipoResumo[];
}

export function FinanceiroVisaoStatusTipo({ statusItems, tipoItems }: FinanceiroVisaoStatusTipoProps) {
  return (
    <section className="grid gap-6 xl:grid-cols-[1.3fr,0.9fr]">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Visão por status</h2>
          <p className="text-sm text-gray-500">Acompanhamento do pipeline financeiro com foco em previsões, aprovações, vencimentos e liquidação.</p>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {statusItems.map((item) => (
            <article key={item.status} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm shadow-gray-100/60">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <p className="mt-1 text-xs text-gray-500">{item.descricao}</p>
                </div>
                <FinanceiroStatusBadge status={item.status} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Quantidade</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">{item.quantidade}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Valor</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">{formatCurrency(item.valor)}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Visão por tipo</h2>
          <p className="text-sm text-gray-500">Separação entre contas a pagar e contas a receber para leitura de exposição do caixa.</p>
        </div>

        <div className="space-y-4">
          {tipoItems.map((item) => (
            <article key={item.tipo} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{FINANCEIRO_TIPO_LABELS[item.tipo]}</h3>
                  <p className="mt-1 text-sm text-gray-500">{item.descricao}</p>
                </div>
                <div className="rounded-full bg-jogab-50 px-3 py-1 text-xs font-semibold text-jogab-700">{item.quantidade} títulos</div>
              </div>
              <div className="mt-4 rounded-lg bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-400">Valor consolidado</p>
                <p className="mt-1 text-xl font-semibold text-gray-900">{formatCurrency(item.valor)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
