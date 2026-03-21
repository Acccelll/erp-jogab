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
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
        <h3 className="text-base font-semibold text-gray-900">Visão por status</h3>
        <div className="mt-4 space-y-3">
          {statusItems.map((item) => (
            <div key={item.status} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-gray-800">{item.label}</p>
                <span className="text-sm text-gray-500">{item.quantidade} item(ns)</span>
              </div>
              <p className="mt-1 text-sm text-gray-500">{item.descricao}</p>
              <p className="mt-2 text-sm font-semibold text-gray-900">{formatCurrency(item.valor)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
        <h3 className="text-base font-semibold text-gray-900">Visão por local</h3>
        <div className="mt-4 space-y-3">
          {localItems.map((item) => (
            <div key={item.localId} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-gray-800">{item.localNome}</p>
                <span className="text-sm text-gray-500">{item.quantidadeItens} itens</span>
              </div>
              <p className="mt-1 text-sm text-gray-500">{item.descricao}</p>
              <p className="mt-2 text-sm font-semibold text-gray-900">{formatCurrency(item.valor)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
        <h3 className="text-base font-semibold text-gray-900">Visão por tipo</h3>
        <div className="mt-4 space-y-3">
          {tipoItems.map((item) => (
            <div key={item.tipo} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-gray-800">{item.label}</p>
                <span className="text-sm text-gray-500">{item.quantidade} item(ns)</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-gray-900">{formatCurrency(item.valor)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
