/**
 * ObraCard — card de obra para listagem.
 * Exibe resumo da obra com status, progresso e dados principais.
 */
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Users, Calendar } from 'lucide-react';
import { ObraStatusBadge } from './ObraStatusBadge';
import { formatCurrency } from '@/shared/lib/utils';
import type { ObraListItem } from '../types';
import { OBRA_TIPO_LABELS } from '../types';

interface ObraCardProps {
  obra: ObraListItem;
}

export function ObraCard({ obra }: ObraCardProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/obras/${obra.id}`)}
      className="w-full rounded-lg border border-gray-200 bg-white p-4 text-left transition-shadow hover:shadow-md"
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-jogab-50 text-jogab-600">
            <Building2 size={16} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">{obra.codigo}</p>
            <h3 className="text-sm font-semibold text-gray-900">{obra.nome}</h3>
          </div>
        </div>
        <ObraStatusBadge status={obra.status} />
      </div>

      {/* Meta info */}
      <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
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

      {/* Type badge */}
      <p className="mb-3 text-xs text-gray-400">{OBRA_TIPO_LABELS[obra.tipo]} · {obra.clienteNome} · {obra.responsavelNome}</p>

      {/* Progress bar */}
      <div className="mb-2">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-gray-500">Progresso</span>
          <span className="font-medium text-gray-700">{obra.percentualConcluido}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-jogab-500 transition-all"
            style={{ width: `${Math.min(obra.percentualConcluido, 100)}%` }}
          />
        </div>
      </div>

      {/* Financeiro */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">Orçamento</span>
        <span className="font-medium text-gray-700">{formatCurrency(obra.orcamentoPrevisto)}</span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">Realizado</span>
        <span className="font-medium text-gray-700">{formatCurrency(obra.custoRealizado)}</span>
      </div>
    </button>
  );
}
