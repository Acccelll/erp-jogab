import { formatCurrency } from '@/shared/lib/utils';
import type { MedicaoItem } from '../types';

interface MedicaoItensTableProps {
  items: MedicaoItem[];
}

export function MedicaoItensTable({ items }: MedicaoItensTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border-default bg-white shadow-sm shadow-gray-100/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-surface-soft">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-text-muted">Item</th>
              <th className="px-4 py-3 text-left font-semibold text-text-muted">Etapa</th>
              <th className="px-4 py-3 text-right font-semibold text-text-muted">Qtd. período</th>
              <th className="px-4 py-3 text-right font-semibold text-text-muted">Acumulado</th>
              <th className="px-4 py-3 text-right font-semibold text-text-muted">% executado</th>
              <th className="px-4 py-3 text-right font-semibold text-text-muted">Valor período</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-surface-soft/70">
                <td className="px-4 py-3 text-text-body">{item.descricao}</td>
                <td className="px-4 py-3 text-text-muted">{item.etapa}</td>
                <td className="px-4 py-3 text-right text-text-body">
                  {item.quantidadePeriodo} {item.unidade}
                </td>
                <td className="px-4 py-3 text-right text-text-body">
                  {item.quantidadeAcumulada} {item.unidade}
                </td>
                <td className="px-4 py-3 text-right text-text-body">{item.percentualExecutado}%</td>
                <td className="px-4 py-3 text-right font-medium text-text-body">{formatCurrency(item.valorPeriodo)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
