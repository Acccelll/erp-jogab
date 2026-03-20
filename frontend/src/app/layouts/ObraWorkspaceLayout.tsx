import { Outlet, NavLink, useParams } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';

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
      {/* Obra tabs */}
      <div className="border-b border-gray-200 bg-white px-6">
        <nav className="-mb-px flex gap-4 overflow-x-auto" aria-label="Abas da obra">
          {obraTabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={`/obras/${obraId}${tab.path ? `/${tab.path}` : ''}`}
              end={tab.path === ''}
              className={({ isActive }) =>
                cn(
                  'whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'border-blue-600 text-blue-600'
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
