import { Link } from 'react-router-dom';
import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import { FINANCEIRO_ORIGEM_LABELS, FINANCEIRO_TIPO_LABELS } from '../types';
import { FinanceiroStatusBadge } from './FinanceiroStatusBadge';
import type { TituloFinanceiro } from '../types';

interface TitulosFinanceirosTableProps {
  items: TituloFinanceiro[];
  emptyLabel?: string;
}

export function TitulosFinanceirosTable({ items, emptyLabel }: TitulosFinanceirosTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm shadow-gray-100/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Título</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Obra</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Competência</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Tipo</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Origem</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Valor</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-500">
                  {emptyLabel ?? 'Nenhum título encontrado para os filtros selecionados.'}
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/70">
                  <td className="px-4 py-3 align-top">
                    <div className="font-medium text-gray-900">{item.codigo}</div>
                    <div className="text-xs text-gray-500">{item.descricao}</div>
                    <div className="mt-1 text-xs text-gray-400">
                      {item.fornecedorCliente}
                      {item.documentoNumero ? ` • ${item.documentoNumero}` : ''}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    <div>{item.obraNome}</div>
                    <div className="text-xs text-gray-400">{item.centroCusto}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{formatCompetencia(item.competencia)}</td>
                  <td className="px-4 py-3 text-gray-700">{FINANCEIRO_TIPO_LABELS[item.tipo]}</td>
                  <td className="px-4 py-3 text-gray-700">{FINANCEIRO_ORIGEM_LABELS[item.origem]}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-800">{formatCurrency(item.valor)}</td>
                  <td className="px-4 py-3"><FinanceiroStatusBadge status={item.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/financeiro/titulos/${item.id}`} className="text-sm font-medium text-jogab-600 hover:text-jogab-700">
                      Ver detalhe
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
