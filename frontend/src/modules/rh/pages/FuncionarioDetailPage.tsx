/**
 * FuncionarioDetailPage — Detalhe do funcionário com header e abas.
 *
 * Funciona como workspace do funcionário, similar ao ObraWorkspaceLayout.
 * Exibe header com dados do funcionário e abas para cada domínio.
 *
 * Referência: docs/06-arquitetura-de-telas.md (RH — detalhe do funcionário com abas)
 */
import { useEffect } from 'react';
import { useParams, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  FileSignature,
  DollarSign,
  FolderOpen,
  Building2,
  Palmtree,
  Gift,
  Wallet,
  Clock,
  Receipt,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { MainContent } from '@/shared/components';
import { FuncionarioHeader } from '../components/FuncionarioHeader';
import { useFuncionarioDetails } from '../hooks/useFuncionarioDetails';
import { useContextStore } from '@/shared/stores';
import type { FuncionarioResumoBloco } from '../types';

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
  const location = useLocation();
  const { funcionario, isLoading } = useFuncionarioDetails(funcId);
  const { setObra } = useContextStore();

  // Sync obra context when funcionario is allocated to an obra
  useEffect(() => {
    if (funcionario?.obraAlocadoId) {
      setObra(funcionario.obraAlocadoId);
    }
  }, [funcionario?.obraAlocadoId, setObra]);

  // Check if we're on the base route (visão geral) — Outlet will be empty
  const isBaseRoute = location.pathname === `/rh/funcionarios/${funcId}`;

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

      {/* Tab content */}
      <div className="flex-1 overflow-auto">
        {isBaseRoute ? (
          <FuncionarioVisaoGeral funcId={funcId} />
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
}

/**
 * Visão geral inline do funcionário (aba padrão).
 * Exibe blocos de resumo: contrato, alocação, provisões, horas extras, documentos, FOPAG.
 */
function FuncionarioVisaoGeral({ funcId }: { funcId: string | undefined }) {
  const { funcionario, resumoBlocos, isLoading, isError } = useFuncionarioDetails(funcId);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-jogab-500 border-t-transparent" />
          <p className="text-sm text-gray-500">Carregando visão geral...</p>
        </div>
      </div>
    );
  }

  if (isError || !funcionario) {
    return (
      <div className="flex flex-1 items-center justify-center py-12">
        <p className="text-sm text-gray-500">Erro ao carregar dados do funcionário.</p>
      </div>
    );
  }

  return (
    <MainContent>
      {/* Resumo por domínio — blocos */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resumoBlocos.map((bloco) => (
          <ResumoBlocoCard key={bloco.titulo} bloco={bloco} />
        ))}
      </div>
    </MainContent>
  );
}

/** Card de bloco de resumo (contrato, alocação, provisões, etc.) */
function ResumoBlocoCard({ bloco }: { bloco: FuncionarioResumoBloco }) {
  const iconMap: Record<string, React.ReactNode> = {
    Contrato: <FileSignature size={16} />,
    Alocação: <Building2 size={16} />,
    Provisões: <Wallet size={16} />,
    'Horas Extras': <Clock size={16} />,
    Documentos: <FolderOpen size={16} />,
    FOPAG: <Receipt size={16} />,
    Férias: <Palmtree size={16} />,
    '13º': <Gift size={16} />,
    'Histórico Salarial': <DollarSign size={16} />,
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-jogab-50 text-jogab-600">
          {iconMap[bloco.titulo] ?? <FileSignature size={16} />}
        </div>
        <h3 className="text-sm font-semibold text-gray-900">{bloco.titulo}</h3>
      </div>
      <ul className="space-y-2">
        {bloco.itens.map((item) => (
          <li key={item.label} className="flex items-center justify-between text-xs">
            <span className="text-gray-500">{item.label}</span>
            <span className={item.destaque ? 'font-semibold text-jogab-600' : 'font-medium text-gray-700'}>
              {item.valor}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
