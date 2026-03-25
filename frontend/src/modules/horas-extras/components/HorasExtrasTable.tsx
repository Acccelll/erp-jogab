import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import { HORA_EXTRA_TIPO_LABELS } from '../types';
import { HoraExtraStatusBadge } from './HoraExtraStatusBadge';
import type { HoraExtraListItem } from '../types';

interface HorasExtrasTableProps {
  items: HoraExtraListItem[];
}

export function HorasExtrasTable({ items }: HorasExtrasTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border-default/80 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200/60 text-sm">
          <thead>
            <tr className="border-b border-border-light">
              <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Funcionário</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Obra</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Competência</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Data</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Tipo</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-text-muted">Horas</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-text-muted">Valor</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/60">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-surface-soft/50">
                <td className="px-3 py-1.5 align-top">
                  <div className="font-medium text-text-strong">{item.funcionarioNome}</div>
                  <div className="text-xs text-text-muted">{item.matricula}</div>
                </td>
                <td className="px-3 py-1.5 text-text-body">{item.obraNome}</td>
                <td className="px-3 py-1.5 text-text-body">{formatCompetencia(item.competencia)}</td>
                <td className="px-3 py-1.5 text-text-body">
                  {new Date(item.dataLancamento).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-3 py-1.5 text-text-body">{HORA_EXTRA_TIPO_LABELS[item.tipo]}</td>
                <td className="px-3 py-1.5 text-right font-medium text-text-body">
                  {item.quantidadeHoras.toFixed(1)} h
                </td>
                <td className="px-3 py-1.5 text-right font-medium text-text-body">
                  {formatCurrency(item.valorCalculado)}
                </td>
                <td className="px-3 py-1.5">
                  <HoraExtraStatusBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
