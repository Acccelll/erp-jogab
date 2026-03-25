/**
 * ObraHeader — header compacto do workspace da obra.
 * Exibe código, nome, status, metadados essenciais em layout denso.
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
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-jogab-100 text-jogab-700">
          <HardHat size={18} />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-medium text-text-subtle">{obra.codigo}</span>
            <h2 className="text-sm font-semibold text-text-strong">{obra.nome}</h2>
            <ObraStatusBadge status={obra.status} />
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-text-muted">
            <span className="flex items-center gap-1">
              <Building2 size={11} />
              {obra.clienteNome}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={11} />
              {obra.cidade}/{obra.uf}
            </span>
            <span className="flex items-center gap-1">
              <Users size={11} />
              {obra.totalFuncionarios}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              {new Date(obra.dataInicio).toLocaleDateString('pt-BR')} —{' '}
              {new Date(obra.dataPrevisaoFim).toLocaleDateString('pt-BR')}
            </span>
            <span className="text-text-subtle">
              {OBRA_TIPO_LABELS[obra.tipo]} · {obra.filialNome}
            </span>
          </div>
        </div>
      </div>

      {/* Compact progress */}
      <div className="shrink-0 text-right">
        <p className="text-lg font-bold text-jogab-700">{obra.percentualConcluido}%</p>
        <p className="text-[10px] text-text-subtle">concluído</p>
      </div>
    </div>
  );
}
