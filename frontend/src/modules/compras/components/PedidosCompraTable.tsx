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
    <div className="overflow-hidden rounded-lg border border-gray-200/80 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200/60 text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Pedido</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Fornecedor</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Obra</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Competência</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Categoria</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Valor</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Status</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/60">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50">
                <td className="px-3 py-1.5 align-top">
                  <div className="font-medium text-gray-900">{item.codigo}</div>
                  <div className="text-xs text-gray-500">
                    Entrega: {new Date(item.previsaoEntrega).toLocaleDateString('pt-BR')}
                  </div>
                </td>
                <td className="px-3 py-1.5 text-gray-700">{item.fornecedorNome}</td>
                <td className="px-3 py-1.5 text-gray-700">{item.obraNome}</td>
                <td className="px-3 py-1.5 text-gray-700">{formatCompetencia(item.competencia)}</td>
                <td className="px-3 py-1.5 text-gray-700">{COMPRA_CATEGORIA_LABELS[item.categoria]}</td>
                <td className="px-3 py-1.5 text-right font-medium text-gray-800">{formatCurrency(item.valorPedido)}</td>
                <td className="px-3 py-1.5">
                  <CompraStatusBadge status={item.status} />
                </td>
                <td className="px-3 py-1.5 text-right">
                  <Link
                    to={`/compras/pedidos/${item.id}`}
                    className="text-xs font-medium text-jogab-600 hover:text-jogab-700"
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
