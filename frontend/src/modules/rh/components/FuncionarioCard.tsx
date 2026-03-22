/**
 * FuncionarioCard — card de funcionário para listagem.
 * Exibe resumo com status, cargo, obra alocada e dados principais.
 */
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Building2, Calendar } from 'lucide-react';
import { FuncionarioStatusBadge } from './FuncionarioStatusBadge';
import { formatCurrency } from '@/shared/lib/utils';
import type { FuncionarioListItem } from '../types';
import { TIPO_CONTRATO_LABELS } from '../types';

interface FuncionarioCardProps {
  funcionario: FuncionarioListItem;
}

export function FuncionarioCard({ funcionario }: FuncionarioCardProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/rh/funcionarios/${funcionario.id}`)}
      className="w-full rounded-lg border border-gray-200 bg-white p-4 text-left transition-shadow hover:shadow-md"
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-jogab-50 text-jogab-600">
            <User size={16} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">{funcionario.matricula}</p>
            <h3 className="text-sm font-semibold text-gray-900">{funcionario.nome}</h3>
          </div>
        </div>
        <FuncionarioStatusBadge status={funcionario.status} />
      </div>

      {/* Cargo e função */}
      <p className="mb-2 text-xs text-gray-600">
        {funcionario.cargo} · {funcionario.funcao}
      </p>

      {/* Meta info */}
      <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
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

      {/* Tipo contrato + departamento */}
      <p className="mb-2 text-xs text-gray-400">
        {TIPO_CONTRATO_LABELS[funcionario.tipoContrato]} · {funcionario.departamento}
      </p>

      {funcionario.centroCustoNome && (
        <p className="mb-3 text-xs text-gray-500">Centro de custo: {funcionario.centroCustoNome}</p>
      )}

      {/* Salário */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">Salário Base</span>
        <span className="font-medium text-gray-700">{formatCurrency(funcionario.salarioBase)}</span>
      </div>
    </button>
  );
}
