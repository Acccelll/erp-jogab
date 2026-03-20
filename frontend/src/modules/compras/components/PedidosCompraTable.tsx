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
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm shadow-gray-100/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Pedido</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Fornecedor</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Obra</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Competência</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Categoria</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Valor</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/70">
                <td className="px-4 py-3 align-top">
                  <div className="font-medium text-gray-900">{item.codigo}</div>
                  <div className="text-xs text-gray-500">Entrega prevista: {new Date(item.previsaoEntrega).toLocaleDateString('pt-BR')}</div>
                </td>
                <td className="px-4 py-3 text-gray-700">{item.fornecedorNome}</td>
                <td className="px-4 py-3 text-gray-700">{item.obraNome}</td>
                <td className="px-4 py-3 text-gray-700">{formatCompetencia(item.competencia)}</td>
                <td className="px-4 py-3 text-gray-700">{COMPRA_CATEGORIA_LABELS[item.categoria]}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-800">{formatCurrency(item.valorPedido)}</td>
                <td className="px-4 py-3"><CompraStatusBadge status={item.status} /></td>
                <td className="px-4 py-3 text-right">
                  <Link to={`/compras/pedidos/${item.id}`} className="text-sm font-medium text-jogab-600 hover:text-jogab-700">
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
