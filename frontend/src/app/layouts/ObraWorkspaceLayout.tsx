import { useEffect } from 'react';
import { Outlet, NavLink, useParams } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';
import { useContextStore } from '@/shared/stores';
import { ObraHeader } from '@/modules/obras/components/ObraHeader';
import { useObraDetails } from '@/modules/obras/hooks/useObraDetails';

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
  const { setObra, obraId: contextObraId } = useContextStore();
  const { obra, isLoading } = useObraDetails(obraId);

  // Sync obra context when entering the workspace
  useEffect(() => {
    if (obraId && obraId !== contextObraId) {
      setObra(obraId);
    }
  }, [obraId, contextObraId, setObra]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Obra header */}
      <div className="border-b border-border-default bg-surface px-6 pt-4 pb-0">
        {/* Dynamic header from obra data */}
        {isLoading && (
          <div className="mb-3 flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-200" />
            <div className="space-y-2">
              <div className="h-5 w-48 animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        )}

        {!isLoading && obra && (
          <div className="mb-3">
            <ObraHeader obra={obra} />
          </div>
        )}

        {!isLoading && !obra && (
          <div className="mb-3">
            <p className="text-sm text-gray-500">Obra não encontrada (ID: {obraId})</p>
          </div>
        )}

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
