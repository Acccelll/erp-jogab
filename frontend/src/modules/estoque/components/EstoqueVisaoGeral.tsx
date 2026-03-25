import { formatCurrency } from '@/shared/lib/utils';
import type { EstoqueLocalResumo, EstoqueStatusResumo, EstoqueTipoResumo } from '../types';

interface EstoqueVisaoGeralProps {
  statusItems: EstoqueStatusResumo[];
  localItems: EstoqueLocalResumo[];
  tipoItems: EstoqueTipoResumo[];
}

export function EstoqueVisaoGeral({ statusItems, localItems, tipoItems }: EstoqueVisaoGeralProps) {
  return (
    <section className="grid gap-4 xl:grid-cols-3">
      <div className="rounded-xl border border-border-default bg-white p-5 shadow-sm shadow-gray-100/60">
        <h3 className="text-base font-semibold text-text-strong">Visão por status</h3>
        <div className="mt-4 space-y-3">
          {statusItems.map((item) => (
            <div key={item.status} className="rounded-lg border border-border-light bg-surface-soft px-3 py-2">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-text-body">{item.label}</p>
                <span className="text-sm text-text-muted">{item.quantidade} item(ns)</span>
              </div>
              <p className="mt-1 text-sm text-text-muted">{item.descricao}</p>
              <p className="mt-2 text-sm font-semibold text-text-strong">{formatCurrency(item.valor)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border-default bg-white p-5 shadow-sm shadow-gray-100/60">
        <h3 className="text-base font-semibold text-text-strong">Visão por local</h3>
        <div className="mt-4 space-y-3">
          {localItems.map((item) => (
            <div key={item.localId} className="rounded-lg border border-border-light bg-surface-soft px-3 py-2">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-text-body">{item.localNome}</p>
                <span className="text-sm text-text-muted">{item.quantidadeItens} itens</span>
              </div>
              <p className="mt-1 text-sm text-text-muted">{item.descricao}</p>
              <p className="mt-2 text-sm font-semibold text-text-strong">{formatCurrency(item.valor)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border-default bg-white p-5 shadow-sm shadow-gray-100/60">
        <h3 className="text-base font-semibold text-text-strong">Visão por tipo</h3>
        <div className="mt-4 space-y-3">
          {tipoItems.map((item) => (
            <div key={item.tipo} className="rounded-lg border border-border-light bg-surface-soft px-3 py-2">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-text-body">{item.label}</p>
                <span className="text-sm text-text-muted">{item.quantidade} item(ns)</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-text-strong">{formatCurrency(item.valor)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
