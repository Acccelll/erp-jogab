import { formatCompetencia } from '@/shared/lib/utils';
import type { HoraExtraHistoricoItem } from '../types';

const EVENTO_LABELS = {
  lancada: 'Lançada',
  aprovada: 'Aprovada',
  rejeitada: 'Rejeitada',
  fechada_para_fopag: 'Fechada para FOPAG',
  enviada_para_fopag: 'Enviada para FOPAG',
  paga: 'Paga',
};

const DESTINO_LABELS = {
  rh: 'RH',
  obra: 'Obra',
  horas_extras: 'Horas Extras',
  fopag: 'FOPAG',
  financeiro: 'Financeiro',
};

const COLUMNS = [
  'Competência',
  'Funcionário',
  'Obra',
  'Evento',
  'Responsável',
  'Destino',
  'Descrição',
];

export function HorasExtrasHistoricoTable({ items }: { items: HoraExtraHistoricoItem[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm shadow-gray-100/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {COLUMNS.map((column) => (
                <th key={column} className="px-4 py-3 text-left font-semibold text-gray-600">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/70">
                <td className="px-4 py-3 text-gray-700">{formatCompetencia(item.competencia)}</td>
                <td className="px-4 py-3 text-gray-700">{item.funcionarioNome}</td>
                <td className="px-4 py-3 text-gray-700">{item.obraNome}</td>
                <td className="px-4 py-3 text-gray-700">{EVENTO_LABELS[item.evento]}</td>
                <td className="px-4 py-3 text-gray-700">{item.responsavel}</td>
                <td className="px-4 py-3 text-gray-700">{DESTINO_LABELS[item.destino]}</td>
                <td className="px-4 py-3 text-gray-700">{item.descricao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
