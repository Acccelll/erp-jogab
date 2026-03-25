import { formatCurrency } from '@/shared/lib/utils';
import type { FopagEventoCompetencia } from '../types';

interface FopagEventosTableProps {
  items: FopagEventoCompetencia[];
}

export function FopagEventosTable({ items }: FopagEventosTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border-default bg-white shadow-sm shadow-gray-100/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-surface-soft">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-text-muted">Evento</th>
              <th className="px-4 py-3 text-left font-semibold text-text-muted">Origem</th>
              <th className="px-4 py-3 text-right font-semibold text-text-muted">Lançamentos</th>
              <th className="px-4 py-3 text-right font-semibold text-text-muted">Previsto</th>
              <th className="px-4 py-3 text-right font-semibold text-text-muted">Realizado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-surface-soft/70">
                <td className="px-4 py-3">
                  <div className="font-medium text-text-strong">{item.nome}</div>
                  <div className="text-xs text-text-muted">
                    {item.codigo} • {item.tipo}
                  </div>
                </td>
                <td className="px-4 py-3 text-text-body">{item.origem}</td>
                <td className="px-4 py-3 text-right text-text-body">{item.quantidadeLancamentos}</td>
                <td className="px-4 py-3 text-right text-text-body">{formatCurrency(item.valorPrevisto)}</td>
                <td className="px-4 py-3 text-right font-medium text-text-strong">
                  {formatCurrency(item.valorRealizado)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
