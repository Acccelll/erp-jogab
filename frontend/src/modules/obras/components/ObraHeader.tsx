/**
 * ObraHeader — header do workspace da obra.
 * Exibe código, nome, status, cliente, progresso e dados essenciais.
 */
import { HardHat, MapPin, Users, Calendar, Building2 } from 'lucide-react';
import { ObraStatusBadge } from './ObraStatusBadge';
import { OBRA_TIPO_LABELS } from '../types';
import type { Obra } from '../types';

interface ObraHeaderProps {
  obra: Obra;
}

export function ObraHeader({ obra }: ObraHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-jogab-50 text-jogab-600">
          <HardHat size={22} />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-gray-400">{obra.codigo}</span>
            <h2 className="text-lg font-semibold text-gray-900">{obra.nome}</h2>
            <ObraStatusBadge status={obra.status} />
          </div>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Building2 size={12} />
              {obra.clienteNome}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {obra.cidade}/{obra.uf}
            </span>
            <span className="flex items-center gap-1">
              <Users size={12} />
              {obra.totalFuncionarios} funcionários
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {new Date(obra.dataInicio).toLocaleDateString('pt-BR')} — {new Date(obra.dataPrevisaoFim).toLocaleDateString('pt-BR')}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-gray-400">
            {OBRA_TIPO_LABELS[obra.tipo]} · {obra.filialNome} · Resp: {obra.responsavelNome}
          </p>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-3 sm:flex-col sm:items-end">
        <div className="text-right">
          <p className="text-2xl font-bold text-jogab-600">{obra.percentualConcluido}%</p>
          <p className="text-[10px] text-gray-400">concluído</p>
        </div>
      </div>
    </div>
  );
}
