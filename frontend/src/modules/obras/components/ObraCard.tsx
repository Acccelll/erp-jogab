/**
 * ObraCard — card de obra para listagem.
 * Exibe resumo da obra com status, progresso e dados principais.
 */
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Users, Calendar, Pencil } from 'lucide-react';
import { ObraStatusBadge } from './ObraStatusBadge';
import { formatCurrency } from '@/shared/lib/utils';
import type { ObraListItem } from '../types';
import { OBRA_TIPO_LABELS } from '../types';

interface ObraCardProps {
  obra: ObraListItem;
  onEdit?: (obraId: string) => void;
}

export function ObraCard({ obra, onEdit }: ObraCardProps) {
  const navigate = useNavigate();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/obras/${obra.id}`)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          navigate(`/obras/${obra.id}`);
        }
      }}
      className="w-full rounded-lg border border-border-default bg-white p-4 text-left transition-shadow hover:shadow-md"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-jogab-50 text-jogab-700">
            <Building2 size={16} />
          </div>
          <div>
            <p className="text-xs font-medium text-text-muted">{obra.codigo}</p>
            <h3 className="text-sm font-semibold text-text-strong">{obra.nome}</h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ObraStatusBadge status={obra.status} />
          {onEdit && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onEdit(obra.id);
              }}
              className="rounded-md border border-border-default p-1.5 text-text-muted hover:bg-surface-soft hover:text-jogab-700"
              aria-label={`Editar ${obra.nome}`}
            >
              <Pencil size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
        <span className="flex items-center gap-1">
          <MapPin size={12} />
          {obra.cidade}/{obra.uf}
        </span>
        <span className="flex items-center gap-1">
          <Users size={12} />
          {obra.totalFuncionarios} func.
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {new Date(obra.dataPrevisaoFim).toLocaleDateString('pt-BR')}
        </span>
      </div>

      <p className="mb-3 text-xs text-text-subtle">
        {OBRA_TIPO_LABELS[obra.tipo]} · {obra.clienteNome} · {obra.responsavelNome}
      </p>

      <div className="mb-2">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-text-muted">Progresso</span>
          <span className="font-medium text-text-body">{obra.percentualConcluido}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-surface-soft">
          <div
            className="h-full rounded-full bg-jogab-700 transition-all"
            style={{ width: `${Math.min(obra.percentualConcluido, 100)}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-text-muted">Orçamento</span>
        <span className="font-medium text-text-body">{formatCurrency(obra.orcamentoPrevisto)}</span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-muted">Realizado</span>
        <span className="font-medium text-text-body">{formatCurrency(obra.custoRealizado)}</span>
      </div>
    </div>
  );
}
