/**
 * ObraHeader — header compacto do workspace da obra.
 * Exibe código, nome, status e progresso com hierarquia clara.
 */
import { MapPin, Users, Calendar } from 'lucide-react';
import { ObraStatusBadge } from './ObraStatusBadge';
import type { Obra } from '../types';

interface ObraHeaderProps {
  obra: Obra;
}

export function ObraHeader({ obra }: ObraHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-mono text-text-subtle">{obra.codigo}</span>
          <h2 className="text-sm font-semibold text-text-strong">{obra.nome}</h2>
          <ObraStatusBadge status={obra.status} />
        </div>
        <div className="flex flex-wrap items-center gap-x-3 text-[10px] text-text-subtle">
          <span className="flex items-center gap-0.5">
            <MapPin size={9} />
            {obra.cidade}/{obra.uf}
          </span>
          <span className="flex items-center gap-0.5">
            <Users size={9} />
            {obra.totalFuncionarios}
          </span>
          <span className="flex items-center gap-0.5">
            <Calendar size={9} />
            {new Date(obra.dataPrevisaoFim).toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-baseline gap-1">
        <span className="text-base font-bold tabular-nums text-brand-primary">{obra.percentualConcluido}%</span>
      </div>
    </div>
  );
}
