import { Link } from 'react-router-dom';
import { formatCompetencia } from '@/shared/lib/utils';
import { DOCUMENTO_ALERTA_LABELS, DOCUMENTO_ENTIDADE_LABELS, DOCUMENTO_TIPO_LABELS } from '../types';
import { DocumentoStatusBadge } from './DocumentoStatusBadge';
import type { Documento } from '../types';

interface DocumentosTableProps {
  items: Documento[];
}

export function DocumentosTable({ items }: DocumentosTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm shadow-gray-100/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Documento</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Entidade vinculada</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Competência</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Tipo</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Vencimento</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/70">
                <td className="px-4 py-3 align-top">
                  <div className="font-medium text-gray-900">{item.codigo}</div>
                  <div className="text-xs text-gray-500">{item.titulo}</div>
                  <div className="mt-1 text-xs text-gray-400">{item.versao} • {item.responsavelNome}</div>
                </td>
                <td className="px-4 py-3 text-gray-700">
                  <div>{item.entidadeNome}</div>
                  <div className="text-xs text-gray-400">{DOCUMENTO_ENTIDADE_LABELS[item.entidade]}{item.obraNome ? ` • ${item.obraNome}` : ''}</div>
                </td>
                <td className="px-4 py-3 text-gray-700">{item.competencia ? formatCompetencia(item.competencia) : '—'}</td>
                <td className="px-4 py-3 text-gray-700">{DOCUMENTO_TIPO_LABELS[item.tipo]}</td>
                <td className="px-4 py-3 text-gray-700">
                  <div>{item.vencimento.dataVencimento ?? 'Sem vencimento'}</div>
                  <div className="text-xs text-gray-400">{DOCUMENTO_ALERTA_LABELS[item.vencimento.alerta]}</div>
                </td>
                <td className="px-4 py-3"><DocumentoStatusBadge status={item.status} /></td>
                <td className="px-4 py-3 text-right">
                  <Link to={`/documentos/${item.id}`} className="text-sm font-medium text-jogab-600 hover:text-jogab-700">Ver detalhe</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
