/**
 * FuncionarioCard — card de funcionário para listagem.
 * Exibe resumo com status, cargo, obra alocada e dados principais.
 */
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Building2, Calendar, Pencil } from 'lucide-react';
import { FuncionarioStatusBadge } from './FuncionarioStatusBadge';
import { formatCurrency } from '@/shared/lib/utils';
import type { FuncionarioListItem } from '../types';
import { TIPO_CONTRATO_LABELS } from '../types';

interface FuncionarioCardProps {
  funcionario: FuncionarioListItem;
  onEdit?: (funcionarioId: string) => void;
}

export function FuncionarioCard({ funcionario, onEdit }: FuncionarioCardProps) {
  const navigate = useNavigate();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/rh/funcionarios/${funcionario.id}`)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          navigate(`/rh/funcionarios/${funcionario.id}`);
        }
      }}
      className="w-full rounded-lg border border-border-default bg-white p-4 text-left transition-shadow hover:shadow-md"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-jogab-50 text-jogab-700">
            <User size={16} />
          </div>
          <div>
            <p className="text-xs font-medium text-text-muted">{funcionario.matricula}</p>
            <h3 className="text-sm font-semibold text-text-strong">{funcionario.nome}</h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FuncionarioStatusBadge status={funcionario.status} />
          {onEdit && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onEdit(funcionario.id);
              }}
              className="rounded-md border border-border-default p-1.5 text-text-muted hover:bg-surface-soft hover:text-jogab-700"
              aria-label={`Editar ${funcionario.nome}`}
            >
              <Pencil size={14} />
            </button>
          )}
        </div>
      </div>

      <p className="mb-2 text-xs text-text-muted">
        {funcionario.cargo} · {funcionario.funcao}
      </p>

      <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
        {funcionario.obraAlocadoNome && (
          <span className="flex items-center gap-1">
            <Building2 size={12} />
            {funcionario.obraAlocadoNome}
          </span>
        )}
        <span className="flex items-center gap-1">
          <MapPin size={12} />
          {funcionario.filialNome}
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {new Date(funcionario.dataAdmissao).toLocaleDateString('pt-BR')}
        </span>
      </div>

      <p className="mb-3 text-xs text-text-subtle">
        {TIPO_CONTRATO_LABELS[funcionario.tipoContrato]} · {funcionario.departamento}
      </p>

      <div className="flex items-center justify-between text-xs">
        <span className="text-text-muted">Salário Base</span>
        <span className="font-medium text-text-body">{formatCurrency(funcionario.salarioBase)}</span>
      </div>
    </div>
  );
}
