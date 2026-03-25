import { formatCurrency } from '@/shared/lib/utils';
import { CompraStatusBadge } from './CompraStatusBadge';
import type { CotacaoCompra } from '../types';

interface CotacoesCompraTableProps {
  items: CotacaoCompra[];
}

export function CotacoesCompraTable({ items }: CotacoesCompraTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border-default bg-white shadow-sm shadow-gray-100/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-surface-soft">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-text-muted">Cotação</th>
              <th className="px-4 py-3 text-left font-semibold text-text-muted">Objeto</th>
              <th className="px-4 py-3 text-left font-semibold text-text-muted">Fornecedor líder</th>
              <th className="px-4 py-3 text-right font-semibold text-text-muted">Valor cotado</th>
              <th className="px-4 py-3 text-left font-semibold text-text-muted">Prazo</th>
              <th className="px-4 py-3 text-left font-semibold text-text-muted">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-surface-soft/70">
                <td className="px-4 py-3 align-top">
                  <div className="font-medium text-text-strong">{item.codigo}</div>
                  <div className="text-xs text-text-muted">{item.obraNome}</div>
                </td>
                <td className="px-4 py-3 text-text-body">{item.objeto}</td>
                <td className="px-4 py-3 text-text-body">{item.fornecedorPrincipal}</td>
                <td className="px-4 py-3 text-right font-medium text-text-body">{formatCurrency(item.valorCotado)}</td>
                <td className="px-4 py-3 text-text-body">{item.melhorPrazoEntrega}</td>
                <td className="px-4 py-3">
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
