import { Outlet, NavLink, useParams } from 'react-router-dom';
import { HardHat } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { StatusBadge } from '@/shared/components';

const obraTabs = [
  { label: 'Visão Geral', path: '' },
  { label: 'Cronograma', path: 'cronograma' },
  { label: 'Contratos', path: 'contratos' },
  { label: 'Equipe', path: 'equipe' },
  { label: 'RH', path: 'rh' },
  { label: 'Compras', path: 'compras' },
  { label: 'Financeiro', path: 'financeiro' },
  { label: 'Estoque', path: 'estoque' },
  { label: 'Medições', path: 'medicoes' },
  { label: 'Documentos', path: 'documentos' },
  { label: 'Riscos', path: 'riscos' },
];

export function ObraWorkspaceLayout() {
  const { obraId } = useParams<{ obraId: string }>();

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Obra header */}
      <div className="border-b border-border-default bg-surface px-6 pt-4 pb-0">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-jogab-50 text-jogab-600">
            <HardHat size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">
                Obra {obraId}
              </h2>
              <StatusBadge label="Ativa" variant="success" />
            </div>
            <p className="text-xs text-gray-500">Workspace da obra — dados simulados</p>
          </div>
        </div>

        {/* Obra tabs */}
        <nav className="-mb-px flex gap-1 overflow-x-auto" aria-label="Abas da obra">
          {obraTabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={`/obras/${obraId}${tab.path ? `/${tab.path}` : ''}`}
              end={tab.path === ''}
              className={({ isActive }) =>
                cn(
                  'whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'border-jogab-600 text-jogab-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                )
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
