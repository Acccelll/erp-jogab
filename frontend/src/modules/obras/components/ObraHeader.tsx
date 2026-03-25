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
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded bg-surface-muted px-1 py-0.5 font-mono text-[9px] font-medium text-text-subtle">
            {obra.codigo}
          </span>
          <h2 className="text-base font-bold tracking-tight text-text-strong">{obra.nome}</h2>
          <ObraStatusBadge status={obra.status} />
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 text-[9px] text-text-subtle/50">
          <span className="flex items-center gap-0.5">
            <MapPin size={10} className="opacity-70" />
            {obra.cidade}/{obra.uf}
          </span>
          <span className="flex items-center gap-0.5">
            <Users size={10} className="opacity-70" />
            {obra.totalFuncionarios} operários
          </span>
          <span className="flex items-center gap-0.5">
            <Calendar size={10} className="opacity-70" />
            Prev. {new Date(obra.dataPrevisaoFim).toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end">
        <span className="text-lg font-bold tabular-nums tracking-tighter text-brand-primary">
          {obra.percentualConcluido}%
        </span>
        <span className="text-[8px] font-medium uppercase tracking-widest text-text-muted">Concluído</span>
      </div>
    </div>
  );
}
