import { Link } from 'react-router-dom';
import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import { FISCAL_DOCUMENTO_TIPO_LABELS, FISCAL_TIPO_OPERACAO_LABELS } from '../types';
import type { DocumentoFiscal } from '../types';
import { FiscalStatusBadge } from './FiscalStatusBadge';

export function FiscalTable({ items }: { items: DocumentoFiscal[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm shadow-gray-100/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Documento', 'Operação', 'Partes', 'Obra', 'Competência', 'Valor', 'Status', 'Ações'].map((column) => (
                <th key={column} className="px-4 py-3 text-left font-semibold text-gray-600">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/70">
                <td className="px-4 py-3 text-gray-700">
                  <p className="font-semibold text-gray-900">{item.codigo}</p>
                  <p className="text-xs text-gray-500">
                    {FISCAL_DOCUMENTO_TIPO_LABELS[item.documentoTipo]} · Nº {item.numero}
                  </p>
                </td>
                <td className="px-4 py-3 text-gray-700">{FISCAL_TIPO_OPERACAO_LABELS[item.tipoOperacao]}</td>
                <td className="px-4 py-3 text-gray-700">
                  <p>{item.emitenteNome}</p>
                  <p className="text-xs text-gray-500">{item.destinatarioNome}</p>
                </td>
                <td className="px-4 py-3 text-gray-700">{item.obraNome ?? 'Sem obra'}</td>
                <td className="px-4 py-3 text-gray-700">{formatCompetencia(item.competencia)}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{formatCurrency(item.valorDocumento)}</td>
                <td className="px-4 py-3"><FiscalStatusBadge status={item.status} /></td>
                <td className="px-4 py-3">
                  <Link to={`/fiscal/documentos/${item.id}`} className="font-medium text-jogab-600 hover:text-jogab-700">
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
