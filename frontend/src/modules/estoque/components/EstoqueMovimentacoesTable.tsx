import { Link } from 'react-router-dom';
import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import { ESTOQUE_MOVIMENTACAO_TIPO_LABELS, ESTOQUE_ORIGEM_LABELS } from '../types';
import { EstoqueStatusBadge } from './EstoqueStatusBadge';
import type { EstoqueMovimentacao } from '../types';

interface EstoqueMovimentacoesTableProps {
  items: EstoqueMovimentacao[];
}

export function EstoqueMovimentacoesTable({ items }: EstoqueMovimentacoesTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm shadow-gray-100/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Movimentação</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Item</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Obra / Local</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Competência</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Quantidade</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Valor</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/70">
                <td className="px-4 py-3 align-top">
                  <div className="font-medium text-gray-900">{ESTOQUE_MOVIMENTACAO_TIPO_LABELS[item.tipo]}</div>
                  <div className="text-xs text-gray-500">{item.dataMovimentacao} • {ESTOQUE_ORIGEM_LABELS[item.origem]}</div>
                  <div className="mt-1 text-xs text-gray-400">{item.observacao}</div>
                </td>
                <td className="px-4 py-3 text-gray-700">
                  <div>{item.itemCodigo}</div>
                  <div className="text-xs text-gray-400">{item.itemDescricao}</div>
                </td>
                <td className="px-4 py-3 text-gray-700">
                  <div>{item.obraNome}</div>
                  <div className="text-xs text-gray-400">{item.localNome} • {item.centroCusto}</div>
                </td>
                <td className="px-4 py-3 text-gray-700">{formatCompetencia(item.competencia)}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-800">{item.quantidade} {item.unidade}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-800">{formatCurrency(item.valorMovimento)}</td>
                <td className="px-4 py-3"><EstoqueStatusBadge status={item.status} /></td>
                <td className="px-4 py-3 text-right">
                  <Link to={`/estoque/itens/${item.itemId}`} className="text-sm font-medium text-jogab-600 hover:text-jogab-700">Ver item</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
