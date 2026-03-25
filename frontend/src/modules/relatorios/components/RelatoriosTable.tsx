import { Link } from 'react-router-dom';
import { RELATORIO_CATEGORIA_LABELS, RELATORIO_DISPONIBILIDADE_LABELS, RELATORIO_FORMATO_LABELS } from '../types';
import type { RelatorioItem } from '../types';

interface RelatoriosTableProps {
  items: RelatorioItem[];
}

export function RelatoriosTable({ items }: RelatoriosTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border-default bg-white shadow-sm shadow-gray-100/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-surface-soft">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-text-muted">Relatório</th>
              <th className="px-4 py-3 text-left font-semibold text-text-muted">Categoria</th>
              <th className="px-4 py-3 text-left font-semibold text-text-muted">Origens</th>
              <th className="px-4 py-3 text-left font-semibold text-text-muted">Disponibilidade</th>
              <th className="px-4 py-3 text-left font-semibold text-text-muted">Saída principal</th>
              <th className="px-4 py-3 text-left font-semibold text-text-muted">Tempo</th>
              <th className="px-4 py-3 text-right font-semibold text-text-muted">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-surface-soft/70">
                <td className="px-4 py-3 align-top">
                  <div className="font-medium text-text-strong">{item.codigo}</div>
                  <div className="text-xs text-text-muted">{item.nome}</div>
                  <div className="mt-1 text-xs text-text-subtle">{item.descricao}</div>
                </td>
                <td className="px-4 py-3 text-text-body">{RELATORIO_CATEGORIA_LABELS[item.categoria]}</td>
                <td className="px-4 py-3 text-text-body">{item.origemDados.join(', ')}</td>
                <td className="px-4 py-3 text-text-body">{RELATORIO_DISPONIBILIDADE_LABELS[item.disponibilidade]}</td>
                <td className="px-4 py-3 text-text-body">{RELATORIO_FORMATO_LABELS[item.output.formatoPrincipal]}</td>
                <td className="px-4 py-3 text-text-body">{item.output.tempoEstimado}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to={`/relatorios/${item.categoria}`}
                    className="text-sm font-medium text-jogab-700 hover:text-jogab-700"
                  >
                    Ver categoria
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
