import { Link } from 'react-router-dom';
import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import { FopagStatusBadge } from './FopagStatusBadge';
import type { FopagCompetenciaListItem } from '../types';

interface FopagCompetenciaCardProps {
  competencia: FopagCompetenciaListItem;
}

export function FopagCompetenciaCard({ competencia }: FopagCompetenciaCardProps) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Competência {formatCompetencia(competencia.competencia)}
          </h3>
          <p className="text-sm text-gray-500">
            Atualizada em {new Date(competencia.updatedAt).toLocaleString('pt-BR')}
          </p>
        </div>
        <FopagStatusBadge status={competencia.status} />
      </div>

      <dl className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg bg-gray-50 p-3">
          <dt className="text-xs uppercase tracking-wide text-gray-400">Funcionários</dt>
          <dd className="mt-1 text-sm font-semibold text-gray-900">{competencia.totalFuncionarios}</dd>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <dt className="text-xs uppercase tracking-wide text-gray-400">Obras</dt>
          <dd className="mt-1 text-sm font-semibold text-gray-900">{competencia.totalObras}</dd>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <dt className="text-xs uppercase tracking-wide text-gray-400">Previsto</dt>
          <dd className="mt-1 text-sm font-semibold text-gray-900">
            {formatCurrency(competencia.valorPrevisto)}
          </dd>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <dt className="text-xs uppercase tracking-wide text-gray-400">Horas Extras</dt>
          <dd className="mt-1 text-sm font-semibold text-gray-900">
            {formatCurrency(competencia.valorHorasExtras)}
          </dd>
        </div>
      </dl>

      <Link
        to={`/fopag/${competencia.id}`}
        className="mt-4 inline-flex text-sm font-medium text-jogab-600 hover:text-jogab-700"
      >
        Abrir detalhe da competência
      </Link>
    </article>
  );
}
