import { formatCurrency } from '@/shared/lib/utils';
import type { EstoqueConsumoObra } from '../types';

interface EstoqueConsumoPorObraTableProps {
  items: EstoqueConsumoObra[];
}

export function EstoqueConsumoPorObraTable({ items }: EstoqueConsumoPorObraTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border-default bg-white shadow-sm shadow-gray-100/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-surface-soft">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-text-muted">Obra</th>
              <th className="px-4 py-3 text-left font-semibold text-text-muted">Centro de custo</th>
              <th className="px-4 py-3 text-right font-semibold text-text-muted">Quantidade consumida</th>
              <th className="px-4 py-3 text-right font-semibold text-text-muted">Valor apropriado</th>
              <th className="px-4 py-3 text-left font-semibold text-text-muted">Última leitura</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.map((item) => (
              <tr key={`${item.obraId}-${item.centroCusto}`} className="hover:bg-surface-soft/70">
                <td className="px-4 py-3 text-text-body">{item.obraNome}</td>
                <td className="px-4 py-3 text-text-muted">{item.centroCusto}</td>
                <td className="px-4 py-3 text-right font-medium text-text-body">{item.quantidadeConsumida}</td>
                <td className="px-4 py-3 text-right font-medium text-text-body">
                  {formatCurrency(item.valorConsumido)}
                </td>
                <td className="px-4 py-3 text-text-muted">{item.ultimaLeituraEm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
