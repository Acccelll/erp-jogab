import { formatCurrency } from '@/shared/lib/utils';
import { CompraStatusBadge } from './CompraStatusBadge';
import type { CotacaoCompra } from '../types';

interface CotacoesCompraTableProps {
  items: CotacaoCompra[];
}

export function CotacoesCompraTable({ items }: CotacoesCompraTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm shadow-gray-100/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Cotação</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Objeto</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Fornecedor líder</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Valor cotado</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Prazo</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/70">
                <td className="px-4 py-3 align-top">
                  <div className="font-medium text-gray-900">{item.codigo}</div>
                  <div className="text-xs text-gray-500">{item.obraNome}</div>
                </td>
                <td className="px-4 py-3 text-gray-700">{item.objeto}</td>
                <td className="px-4 py-3 text-gray-700">{item.fornecedorPrincipal}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-800">{formatCurrency(item.valorCotado)}</td>
                <td className="px-4 py-3 text-gray-700">{item.melhorPrazoEntrega}</td>
                <td className="px-4 py-3"><CompraStatusBadge status={item.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
