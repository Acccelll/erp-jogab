/**
 * FuncionarioHeader — header compacto do detalhe do funcionário.
 * Exibe matrícula, nome, status, cargo e metadados essenciais em layout denso.
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
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-jogab-50 text-jogab-600">
        <User size={18} />
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-medium text-gray-400">{funcionario.matricula}</span>
          <h2 className="text-sm font-semibold text-gray-900">{funcionario.nome}</h2>
          <FuncionarioStatusBadge status={funcionario.status} />
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-gray-500">
          <span className="flex items-center gap-1">
            <Briefcase size={11} />
            {funcionario.cargo} · {funcionario.funcao}
          </span>
          {funcionario.obraAlocadoNome && (
            <span className="flex items-center gap-1">
              <Building2 size={11} />
              {funcionario.obraAlocadoNome}
            </span>
          )}
          <span className="flex items-center gap-1">
            <MapPin size={11} />
            {funcionario.cidade}/{funcionario.uf}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            {new Date(funcionario.dataAdmissao).toLocaleDateString('pt-BR')}
          </span>
          {funcionario.email && (
            <span className="flex items-center gap-1">
              <Mail size={11} />
              {funcionario.email}
            </span>
          )}
          <span className="text-gray-400">
            {TIPO_CONTRATO_LABELS[funcionario.tipoContrato]} · {funcionario.departamento}
          </span>
        </div>
      </div>
    </div>
  );
}
