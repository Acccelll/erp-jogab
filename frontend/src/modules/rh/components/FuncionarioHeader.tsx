/**
 * FuncionarioHeader — header do detalhe do funcionário.
 * Exibe matrícula, nome, status, cargo, obra alocada e dados essenciais.
 */
import { User, MapPin, Building2, Calendar, Briefcase, Mail } from 'lucide-react';
import { FuncionarioStatusBadge } from './FuncionarioStatusBadge';
import { TIPO_CONTRATO_LABELS } from '../types';
import type { Funcionario } from '../types';

interface FuncionarioHeaderProps {
  funcionario: Funcionario;
}

export function FuncionarioHeader({ funcionario }: FuncionarioHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-jogab-50 text-jogab-600">
          <User size={22} />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-gray-400">{funcionario.matricula}</span>
            <h2 className="text-lg font-semibold text-gray-900">{funcionario.nome}</h2>
            <FuncionarioStatusBadge status={funcionario.status} />
          </div>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Briefcase size={12} />
              {funcionario.cargo} · {funcionario.funcao}
            </span>
            {funcionario.obraAlocadoNome && (
              <span className="flex items-center gap-1">
                <Building2 size={12} />
                {funcionario.obraAlocadoNome}
              </span>
            )}
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {funcionario.cidade}/{funcionario.uf}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              Admissão: {new Date(funcionario.dataAdmissao).toLocaleDateString('pt-BR')}
            </span>
            {funcionario.email && (
              <span className="flex items-center gap-1">
                <Mail size={12} />
                {funcionario.email}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-gray-400">
            {TIPO_CONTRATO_LABELS[funcionario.tipoContrato]} · {funcionario.departamento} · {funcionario.filialNome}
            {funcionario.gestorNome ? ` · Gestor: ${funcionario.gestorNome}` : ''}
          </p>
        </div>
      </div>
    </div>
  );
}
