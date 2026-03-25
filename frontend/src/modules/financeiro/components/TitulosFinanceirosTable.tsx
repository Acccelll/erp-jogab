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
    <div className="overflow-hidden rounded-lg border border-border-default/80 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200/60 text-sm">
          <thead>
            <tr className="border-b border-border-light">
              <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Título</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Obra</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Competência</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Tipo</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Origem</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-text-muted">Valor</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Status</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-text-muted">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/60">
            {items.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-sm text-text-muted">
                  {emptyLabel ?? 'Nenhum título encontrado para os filtros selecionados.'}
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-surface-soft/50">
                  <td className="px-3 py-1.5 align-top">
                    <div className="font-medium text-text-strong">{item.codigo}</div>
                    <div className="text-xs text-text-muted">{item.descricao}</div>
                    <div className="text-[11px] text-text-subtle">
                      {item.fornecedorCliente}
                      {item.documentoNumero ? ` • ${item.documentoNumero}` : ''}
                    </div>
                  </td>
                  <td className="px-3 py-1.5 text-text-body">
                    <div>{item.obraNome}</div>
                    <div className="text-xs text-text-subtle">{item.centroCusto}</div>
                  </td>
                  <td className="px-3 py-1.5 text-text-body">{formatCompetencia(item.competencia)}</td>
                  <td className="px-3 py-1.5 text-text-body">{FINANCEIRO_TIPO_LABELS[item.tipo]}</td>
                  <td className="px-3 py-1.5 text-text-body">{FINANCEIRO_ORIGEM_LABELS[item.origem]}</td>
                  <td className="px-3 py-1.5 text-right font-medium text-text-body">{formatCurrency(item.valor)}</td>
                  <td className="px-3 py-1.5">
                    <FinanceiroStatusBadge status={item.status} />
                  </td>
                  <td className="px-3 py-1.5 text-right">
                    <Link
                      to={`/financeiro/titulos/${item.id}`}
                      className="text-xs font-medium text-jogab-700 hover:text-jogab-700"
                    >
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
