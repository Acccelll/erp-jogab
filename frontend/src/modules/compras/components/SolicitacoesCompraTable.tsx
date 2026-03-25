import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import { CompraStatusBadge } from './CompraStatusBadge';
import { COMPRA_CATEGORIA_LABELS, COMPRA_PRIORIDADE_LABELS } from '../types';
import type { SolicitacaoCompra } from '../types';

interface SolicitacoesCompraTableProps {
  items: SolicitacaoCompra[];
}

export function SolicitacoesCompraTable({ items }: SolicitacoesCompraTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border-default/80 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200/60 text-sm">
          <thead>
            <tr className="border-b border-border-light">
              <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Solicitação</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Obra</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Competência</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Categoria</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Prioridade</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-text-muted">Valor estimado</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/60">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-surface-soft/50">
                <td className="px-3 py-1.5 align-top">
                  <div className="font-medium text-text-strong">{item.codigo}</div>
                  <div className="text-xs text-text-muted">{item.titulo}</div>
                </td>
                <td className="px-3 py-1.5 text-text-body">{item.obraNome}</td>
                <td className="px-3 py-1.5 text-text-body">{formatCompetencia(item.competencia)}</td>
                <td className="px-3 py-1.5 text-text-body">{COMPRA_CATEGORIA_LABELS[item.categoria]}</td>
                <td className="px-3 py-1.5 text-text-body">{COMPRA_PRIORIDADE_LABELS[item.prioridade]}</td>
                <td className="px-3 py-1.5 text-right font-medium text-text-body">
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
