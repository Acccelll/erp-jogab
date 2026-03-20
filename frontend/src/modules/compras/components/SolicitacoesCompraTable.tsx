import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import { CompraStatusBadge } from './CompraStatusBadge';
import { COMPRA_CATEGORIA_LABELS, COMPRA_PRIORIDADE_LABELS } from '../types';
import type { SolicitacaoCompra } from '../types';

interface SolicitacoesCompraTableProps {
  items: SolicitacaoCompra[];
}

export function SolicitacoesCompraTable({ items }: SolicitacoesCompraTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm shadow-gray-100/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Solicitação</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Obra</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Competência</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Categoria</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Prioridade</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Valor estimado</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/70">
                <td className="px-4 py-3 align-top">
                  <div className="font-medium text-gray-900">{item.codigo}</div>
                  <div className="text-xs text-gray-500">{item.titulo}</div>
                </td>
                <td className="px-4 py-3 text-gray-700">{item.obraNome}</td>
                <td className="px-4 py-3 text-gray-700">{formatCompetencia(item.competencia)}</td>
                <td className="px-4 py-3 text-gray-700">{COMPRA_CATEGORIA_LABELS[item.categoria]}</td>
                <td className="px-4 py-3 text-gray-700">{COMPRA_PRIORIDADE_LABELS[item.prioridade]}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-800">{formatCurrency(item.valorEstimado)}</td>
                <td className="px-4 py-3"><CompraStatusBadge status={item.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
