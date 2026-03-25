import { NavLink, Outlet, useParams } from 'react-router-dom';
import { cn, formatCompetencia } from '@/shared/lib/utils';
import { useFopagCompetenciaDetails } from '../hooks';
import { FopagStatusBadge } from '../components';

const tabs = [
  { label: 'Visão Geral', path: '' },
  { label: 'Por Funcionário', path: 'funcionarios' },
  { label: 'Por Obra', path: 'obras' },
  { label: 'Eventos', path: 'eventos' },
  { label: 'Rateio', path: 'rateio' },
  { label: 'Financeiro', path: 'financeiro' },
  { label: 'Previsto x Realizado', path: 'previsto-realizado' },
];

export function FopagCompetenciaDetailPage() {
  const { competenciaId } = useParams<{ competenciaId: string }>();
  const { detalhe, isLoading } = useFopagCompetenciaDetails(competenciaId);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-b border-border-default bg-surface px-6 pt-4 pb-0">
        {isLoading && <div className="mb-3 h-12 animate-pulse rounded-lg bg-surface-soft" />}

        {!isLoading && detalhe && (
          <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-text-strong">
                Competência {formatCompetencia(detalhe.competencia.competencia)}
              </h1>
              <p className="text-sm text-text-muted">
                Folha prevista com leitura consolidada por funcionário, obra, eventos, rateio e financeiro.
              </p>
            </div>
            <FopagStatusBadge status={detalhe.competencia.status} />
          </div>
        )}

        {!isLoading && !detalhe && <p className="mb-3 text-sm text-text-muted">Competência não encontrada.</p>}

        <nav className="-mb-px flex gap-1 overflow-x-auto" aria-label="Abas da competência FOPAG">
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={`/fopag/${competenciaId}${tab.path ? `/${tab.path}` : ''}`}
              end={tab.path === ''}
              className={({ isActive }) =>
                cn(
                  'whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'border-jogab-600 text-jogab-700'
                    : 'border-transparent text-text-muted hover:border-gray-300 hover:text-text-body',
                )
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
