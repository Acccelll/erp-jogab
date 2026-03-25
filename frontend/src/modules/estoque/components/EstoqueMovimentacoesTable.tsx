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
    <div className="overflow-hidden rounded-xl border border-border-default bg-white shadow-sm shadow-gray-100/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-surface-soft">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-text-muted">Movimentação</th>
              <th className="px-4 py-3 text-left font-semibold text-text-muted">Item</th>
              <th className="px-4 py-3 text-left font-semibold text-text-muted">Obra / Local</th>
              <th className="px-4 py-3 text-left font-semibold text-text-muted">Competência</th>
              <th className="px-4 py-3 text-right font-semibold text-text-muted">Quantidade</th>
              <th className="px-4 py-3 text-right font-semibold text-text-muted">Valor</th>
              <th className="px-4 py-3 text-left font-semibold text-text-muted">Status</th>
              <th className="px-4 py-3 text-right font-semibold text-text-muted">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-surface-soft/70">
                <td className="px-4 py-3 align-top">
                  <div className="font-medium text-text-strong">{ESTOQUE_MOVIMENTACAO_TIPO_LABELS[item.tipo]}</div>
                  <div className="text-xs text-text-muted">
                    {item.dataMovimentacao} • {ESTOQUE_ORIGEM_LABELS[item.origem]}
                  </div>
                  <div className="mt-1 text-xs text-text-subtle">{item.observacao}</div>
                </td>
                <td className="px-4 py-3 text-text-body">
                  <div>{item.itemCodigo}</div>
                  <div className="text-xs text-text-subtle">{item.itemDescricao}</div>
                </td>
                <td className="px-4 py-3 text-text-body">
                  <div>{item.obraNome}</div>
                  <div className="text-xs text-text-subtle">
                    {item.localNome} • {item.centroCusto}
                  </div>
                </td>
                <td className="px-4 py-3 text-text-body">{formatCompetencia(item.competencia)}</td>
                <td className="px-4 py-3 text-right font-medium text-text-body">
                  {item.quantidade} {item.unidade}
                </td>
                <td className="px-4 py-3 text-right font-medium text-text-body">
                  {formatCurrency(item.valorMovimento)}
                </td>
                <td className="px-4 py-3">
                  <EstoqueStatusBadge status={item.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to={`/estoque/itens/${item.itemId}`}
                    className="text-sm font-medium text-jogab-700 hover:text-jogab-700"
                  >
                    Ver item
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
