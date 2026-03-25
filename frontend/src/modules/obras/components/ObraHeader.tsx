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
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <h2 className="text-base font-bold tracking-tight text-text-strong">{obra.nome}</h2>
          <span className="font-mono text-[10px] text-text-muted/40">{obra.codigo}</span>
          <ObraStatusBadge status={obra.status} />
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 text-[10px] text-text-muted/60">
          <span className="flex items-center gap-1">
            <MapPin size={12} className="opacity-40" />
            {obra.cidade}/{obra.uf}
          </span>
          <span className="flex items-center gap-1">
            <Users size={12} className="opacity-40" />
            {obra.totalFuncionarios} alocados
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={12} className="opacity-40" />
            Previsão: {new Date(obra.dataPrevisaoFim).toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 border-l border-border-default/40 pl-4">
        <div className="flex flex-col items-end">
          <span className="text-lg font-bold tabular-nums tracking-tighter text-brand-primary">
            {obra.percentualConcluido}%
          </span>
          <span className="text-[9px] font-medium uppercase tracking-widest text-text-muted/60">Concluído</span>
        </div>
        <div className="h-8 w-1.5 rounded-full bg-surface-muted overflow-hidden flex flex-col justify-end">
          <div
            className="bg-brand-primary w-full transition-all duration-500 rounded-full"
            style={{ height: `${Math.max(obra.percentualConcluido, 5)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
