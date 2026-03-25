import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import { CompraStatusBadge } from './CompraStatusBadge';
import { COMPRA_CATEGORIA_LABELS, COMPRA_PRIORIDADE_LABELS } from '../types';
import type { SolicitacaoCompra } from '../types';

interface SolicitacoesCompraTableProps {
  items: SolicitacaoCompra[];
}

export function SolicitacoesCompraTable({ items }: SolicitacoesCompraTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200/80 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200/60 text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Solicitação</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Obra</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Competência</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Categoria</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Prioridade</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Valor estimado</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/60">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50">
                <td className="px-3 py-1.5 align-top">
                  <div className="font-medium text-gray-900">{item.codigo}</div>
                  <div className="text-xs text-gray-500">{item.titulo}</div>
                </td>
                <td className="px-3 py-1.5 text-gray-700">{item.obraNome}</td>
                <td className="px-3 py-1.5 text-gray-700">{formatCompetencia(item.competencia)}</td>
                <td className="px-3 py-1.5 text-gray-700">{COMPRA_CATEGORIA_LABELS[item.categoria]}</td>
                <td className="px-3 py-1.5 text-gray-700">{COMPRA_PRIORIDADE_LABELS[item.prioridade]}</td>
                <td className="px-3 py-1.5 text-right font-medium text-gray-800">
                  {formatCurrency(item.valorEstimado)}
                </td>
                <td className="px-3 py-1.5">
                  <CompraStatusBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
