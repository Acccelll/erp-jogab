import { Link } from 'react-router-dom';
import { RELATORIO_CATEGORIA_LABELS, RELATORIO_DISPONIBILIDADE_LABELS } from '../types';
import type { RelatorioItem } from '../types';

interface RelatoriosTableProps {
  items: RelatorioItem[];
}

export function RelatoriosTable({ items }: RelatoriosTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm shadow-gray-100/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Relatório</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Categoria</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Origens</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Disponibilidade</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Saídas</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/70">
                <td className="px-4 py-3 align-top">
                  <div className="font-medium text-gray-900">{item.codigo}</div>
                  <div className="text-xs text-gray-500">{item.nome}</div>
                  <div className="mt-1 text-xs text-gray-400">{item.descricao}</div>
                </td>
                <td className="px-4 py-3 text-gray-700">{RELATORIO_CATEGORIA_LABELS[item.categoria]}</td>
                <td className="px-4 py-3 text-gray-700">{item.origemDados.join(', ')}</td>
                <td className="px-4 py-3 text-gray-700">{RELATORIO_DISPONIBILIDADE_LABELS[item.disponibilidade]}</td>
                <td className="px-4 py-3 text-gray-700">{item.output.formatos.join(', ')}</td>
                <td className="px-4 py-3 text-right">
                  <Link to={`/relatorios/${item.categoria}`} className="text-sm font-medium text-jogab-600 hover:text-jogab-700">Ver categoria</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
