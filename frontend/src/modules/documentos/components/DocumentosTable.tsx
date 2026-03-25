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
    <div className="overflow-hidden rounded-xl border border-border-default bg-white shadow-sm shadow-gray-100/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-surface-soft">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-text-muted">Documento</th>
              <th className="px-4 py-3 text-left font-semibold text-text-muted">Entidade vinculada</th>
              <th className="px-4 py-3 text-left font-semibold text-text-muted">Competência</th>
              <th className="px-4 py-3 text-left font-semibold text-text-muted">Tipo</th>
              <th className="px-4 py-3 text-left font-semibold text-text-muted">Vencimento</th>
              <th className="px-4 py-3 text-left font-semibold text-text-muted">Status</th>
              <th className="px-4 py-3 text-right font-semibold text-text-muted">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-surface-soft/70">
                <td className="px-4 py-3 align-top">
                  <div className="font-medium text-text-strong">{item.codigo}</div>
                  <div className="text-xs text-text-muted">{item.titulo}</div>
                  <div className="mt-1 text-xs text-text-subtle">
                    {item.versao} • {item.responsavelNome}
                  </div>
                </td>
                <td className="px-4 py-3 text-text-body">
                  <div>{item.entidadeNome}</div>
                  <div className="text-xs text-text-subtle">
                    {DOCUMENTO_ENTIDADE_LABELS[item.entidade]}
                    {item.obraNome ? ` • ${item.obraNome}` : ''}
                  </div>
                </td>
                <td className="px-4 py-3 text-text-body">
                  {item.competencia ? formatCompetencia(item.competencia) : '—'}
                </td>
                <td className="px-4 py-3 text-text-body">{DOCUMENTO_TIPO_LABELS[item.tipo]}</td>
                <td className="px-4 py-3 text-text-body">
                  <div>{item.vencimento.dataVencimento ?? 'Sem vencimento'}</div>
                  <div className="text-xs text-text-subtle">{DOCUMENTO_ALERTA_LABELS[item.vencimento.alerta]}</div>
                </td>
                <td className="px-4 py-3">
                  <DocumentoStatusBadge status={item.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to={`/documentos/${item.id}`}
                    className="text-sm font-medium text-jogab-700 hover:text-jogab-700"
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
