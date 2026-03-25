import { Link } from 'react-router-dom';
import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import { CompraStatusBadge } from './CompraStatusBadge';
import { COMPRA_CATEGORIA_LABELS } from '../types';
import type { PedidoCompra } from '../types';

interface PedidosCompraTableProps {
  items: PedidoCompra[];
}

export function PedidosCompraTable({ items }: PedidosCompraTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border-default/80 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200/60 text-sm">
          <thead>
            <tr className="border-b border-border-light">
              <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Pedido</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Fornecedor</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Obra</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Competência</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Categoria</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-text-muted">Valor</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Status</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-text-muted">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/60">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-surface-soft/50">
                <td className="px-3 py-1.5 align-top">
                  <div className="font-medium text-text-strong">{item.codigo}</div>
                  <div className="text-xs text-text-muted">
                    Entrega: {new Date(item.previsaoEntrega).toLocaleDateString('pt-BR')}
                  </div>
                </td>
                <td className="px-3 py-1.5 text-text-body">{item.fornecedorNome}</td>
                <td className="px-3 py-1.5 text-text-body">{item.obraNome}</td>
                <td className="px-3 py-1.5 text-text-body">{formatCompetencia(item.competencia)}</td>
                <td className="px-3 py-1.5 text-text-body">{COMPRA_CATEGORIA_LABELS[item.categoria]}</td>
                <td className="px-3 py-1.5 text-right font-medium text-text-body">
                  {formatCurrency(item.valorPedido)}
                </td>
                <td className="px-3 py-1.5">
                  <CompraStatusBadge status={item.status} />
                </td>
                <td className="px-3 py-1.5 text-right">
                  <Link
                    to={`/compras/pedidos/${item.id}`}
                    className="text-xs font-medium text-jogab-700 hover:text-jogab-700"
                  >
                    Ver detalhe
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
