import { Link } from 'react-router-dom';
import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import { MEDICAO_APROVACAO_LABELS, MEDICAO_FATURAMENTO_LABELS } from '../types';
import { MedicaoStatusBadge } from './MedicaoStatusBadge';
import type { Medicao } from '../types';

interface MedicoesTableProps {
  items: Medicao[];
}

export function MedicoesTable({ items }: MedicoesTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm shadow-gray-100/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Medição</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Obra / Contrato</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Competência</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Valor medido</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Aprovação</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Faturamento</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/70">
                <td className="px-4 py-3 align-top">
                  <div className="font-medium text-gray-900">{item.codigo}</div>
                  <div className="text-xs text-gray-500">Medição #{item.numeroMedicao} • {item.clienteNome}</div>
                  <div className="mt-1 text-xs text-gray-400">Avanço {item.percentualAvanco}% • {item.responsavelNome}</div>
                </td>
                <td className="px-4 py-3 text-gray-700">
                  <div>{item.obraNome}</div>
                  <div className="text-xs text-gray-400">{item.contratoCodigo} • {item.centroCusto}</div>
                </td>
                <td className="px-4 py-3 text-gray-700">{formatCompetencia(item.competencia)}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-800">{formatCurrency(item.resumoFinanceiro.valorMedido)}</td>
                <td className="px-4 py-3 text-gray-700">{MEDICAO_APROVACAO_LABELS[item.aprovacaoStatus]}</td>
                <td className="px-4 py-3 text-gray-700">{MEDICAO_FATURAMENTO_LABELS[item.faturamentoStatus]}</td>
                <td className="px-4 py-3"><MedicaoStatusBadge status={item.status} /></td>
                <td className="px-4 py-3 text-right">
                  <Link to={`/medicoes/${item.id}`} className="text-sm font-medium text-jogab-600 hover:text-jogab-700">Ver detalhe</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
