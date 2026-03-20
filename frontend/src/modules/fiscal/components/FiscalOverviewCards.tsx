import { formatCurrency } from '@/shared/lib/utils';
import { FiscalStatusBadge } from './FiscalStatusBadge';
import { FISCAL_TIPO_LABELS } from '../types';
import type { FiscalStatusResumo, FiscalTipoResumo } from '../types';

interface FiscalOverviewCardsProps {
  statusItems: FiscalStatusResumo[];
  tipoItems: FiscalTipoResumo[];
}

export function FiscalOverviewCards({ statusItems, tipoItems }: FiscalOverviewCardsProps) {
  return (
    <section className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Visão por status</h2>
          <p className="text-sm text-gray-500">Acompanhamento da escrituração, validação e envio para financeiro.</p>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {statusItems.map((item) => (
            <article key={item.status} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm shadow-gray-100/60">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <p className="mt-1 text-xs text-gray-500">{item.descricao}</p>
                </div>
                <FiscalStatusBadge status={item.status} />
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
          <p className="text-sm text-gray-500">Leitura inicial do mix fiscal entre entradas e saídas.</p>
        </div>
        <div className="space-y-3">
          {tipoItems.map((item) => (
            <article key={item.tipo} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm shadow-gray-100/60">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{FISCAL_TIPO_LABELS[item.tipo]}</p>
                  <p className="text-xs text-gray-500">{item.quantidade} documento(s)</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">{formatCurrency(item.valor)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
