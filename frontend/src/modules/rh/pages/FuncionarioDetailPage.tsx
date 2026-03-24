/**
 * FuncionarioDetailPage — Detalhe do funcionário com header e abas.
 *
 * Funciona como workspace do funcionário, similar ao ObraWorkspaceLayout.
 * Exibe header com dados do funcionário e abas para cada domínio.
 * O conteúdo de cada aba (incluindo "Visão Geral") é renderizado via <Outlet />,
 * com a "Visão Geral" mapeada como index route no router.
 *
 * Referência: docs/06-arquitetura-de-telas.md (RH — detalhe do funcionário com abas)
 */
import { useEffect, useRef } from 'react';
import { useParams, NavLink, Outlet } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { FuncionarioHeader } from '../components/FuncionarioHeader';
import { useFuncionarioDetails } from '../hooks/useFuncionarioDetails';
import { useContextStore } from '@/shared/stores';

/** Abas do detalhe do funcionário */
const funcionarioTabs = [
  { label: 'Visão Geral', path: '' },
  { label: 'Contrato', path: 'contrato' },
  { label: 'Histórico Salarial', path: 'historico-salarial' },
  { label: 'Documentos', path: 'documentos' },
  { label: 'Alocações', path: 'alocacoes' },
  { label: 'Férias', path: 'ferias' },
  { label: '13º', path: 'decimo-terceiro' },
  { label: 'Provisões', path: 'provisoes' },
  { label: 'Horas Extras', path: 'horas-extras' },
  { label: 'FOPAG', path: 'fopag' },
];

export function FuncionarioDetailPage() {
  const { funcId } = useParams<{ funcId: string }>();
  const { funcionario, isLoading } = useFuncionarioDetails(funcId);

  // Sync obra/centro de custo context when funcionario is allocated to an obra.
  // Use a ref to track whether we already synced for this funcionario to avoid cascading
  // re-renders caused by setObra resetting centroCustoId to null.
  const syncedFuncIdRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    const obraAlocado = funcionario?.obraAlocadoId;
    const ccId = funcionario?.centroCustoId;
    if (!obraAlocado || syncedFuncIdRef.current === funcId) return;
    syncedFuncIdRef.current = funcId;

    // Use store.setState directly to batch both values in a single update,
    // avoiding the intermediate state where setObra clears centroCustoId.
    useContextStore.setState({ obraId: obraAlocado, centroCustoId: ccId ?? null });
  }, [funcId, funcionario?.obraAlocadoId, funcionario?.centroCustoId]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-border-default bg-surface px-6 pt-4 pb-0">
        {/* Back link */}
        <div className="mb-2">
          <NavLink
            to="/rh/funcionarios"
            className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft size={12} />
            Voltar para lista
          </NavLink>
        </div>

        {/* Dynamic header from funcionario data */}
        {isLoading && (
          <div className="mb-3 flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
            <div className="space-y-2">
              <div className="h-5 w-48 animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        )}

        {!isLoading && funcionario && (
          <div className="mb-3">
            <FuncionarioHeader funcionario={funcionario} />
          </div>
        )}

        {!isLoading && !funcionario && (
          <div className="mb-3">
            <p className="text-sm text-gray-500">Funcionário não encontrado (ID: {funcId})</p>
          </div>
        )}

        {/* Tabs */}
        <nav className="-mb-px flex gap-1 overflow-x-auto" aria-label="Abas do funcionário">
          {funcionarioTabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={`/rh/funcionarios/${funcId}${tab.path ? `/${tab.path}` : ''}`}
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

      {/* Tab content — always via Outlet (index route = Visão Geral) */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
