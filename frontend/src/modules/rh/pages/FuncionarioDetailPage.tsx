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
import { OverflowTabs } from '@/shared/components';
import { FuncionarioHeader } from '../components/FuncionarioHeader';
import { useFuncionarioDetails } from '../hooks/useFuncionarioDetails';
import { useContextStore } from '@/shared/stores';

/** Abas do detalhe do funcionário — 5 mais usadas primeiro */
const funcionarioTabs = [
  { label: 'Visão Geral', path: '' },
  { label: 'Contrato', path: 'contrato' },
  { label: 'Alocações', path: 'alocacoes' },
  { label: 'Horas Extras', path: 'horas-extras' },
  { label: 'Histórico Salarial', path: 'historico-salarial' },
  { label: 'Documentos', path: 'documentos' },
  { label: 'Férias', path: 'ferias' },
  { label: '13º', path: 'decimo-terceiro' },
  { label: 'Provisões', path: 'provisoes' },
  { label: 'FOPAG', path: 'fopag' },
];

export function FuncionarioDetailPage() {
  const { funcId } = useParams<{ funcId: string }>();
  const { funcionario, isLoading } = useFuncionarioDetails(funcId);

  // Sync obra/centro de custo context when funcionario is allocated to an obra.
  // Uses store.setState to batch both values in a single update, avoiding the
  // intermediate state where setObra clears centroCustoId (which caused cascading re-renders).
  // Tracks last-synced values in a ref to prevent infinite effect cycles while still
  // re-syncing when the funcionario data changes (e.g. after an edit).
  const syncedRef = useRef<{ funcId?: string; obraId?: string; ccId?: string | null }>({});
  useEffect(() => {
    const obraAlocado = funcionario?.obraAlocadoId;
    const ccId = funcionario?.centroCustoId ?? null;
    if (!obraAlocado) return;

    const prev = syncedRef.current;
    if (prev.funcId === funcId && prev.obraId === obraAlocado && prev.ccId === ccId) return;
    syncedRef.current = { funcId, obraId: obraAlocado, ccId };

    useContextStore.setState({ obraId: obraAlocado, centroCustoId: ccId });
  }, [funcId, funcionario?.obraAlocadoId, funcionario?.centroCustoId]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-surface px-4 pt-2 pb-0">
        {/* Back link */}
        <div className="mb-1">
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
          <div className="mb-1.5 flex items-center gap-2.5">
            <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
            <div className="space-y-1">
              <div className="h-3.5 w-48 animate-pulse rounded bg-gray-200" />
              <div className="h-2.5 w-32 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        )}

        {!isLoading && funcionario && (
          <div className="mb-1.5">
            <FuncionarioHeader funcionario={funcionario} />
          </div>
        )}

        {!isLoading && !funcionario && (
          <div className="mb-1.5">
            <p className="text-sm text-gray-500">Funcionário não encontrado (ID: {funcId})</p>
          </div>
        )}

        {/* Tabs with overflow */}
        <OverflowTabs tabs={funcionarioTabs} maxVisible={5} basePath={`/rh/funcionarios/${funcId}`} />
      </div>

      {/* Tab content — always via Outlet (index route = Visão Geral) */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
