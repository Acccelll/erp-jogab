/**
 * FuncionarioDetailPage — Detalhe do funcionário com header e abas.
 *
 * Funciona como workspace do funcionário, similar ao ObraWorkspaceLayout.
 * Exibe header com dados do funcionário e abas para cada domínio.
 *
 * Referência: docs/06-arquitetura-de-telas.md (RH — detalhe do funcionário com abas)
 */
import { useEffect } from 'react';
import { useParams, NavLink, Outlet, useLocation, Link } from 'react-router-dom';
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
  MapPinned,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { MainContent } from '@/shared/components';
import { FuncionarioHeader } from '../components/FuncionarioHeader';
import { useFuncionarioDetails } from '../hooks/useFuncionarioDetails';
import { useContextStore } from '@/shared/stores';
import type { FuncionarioResumoBloco } from '../types';

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
  const { setObra, setCentroCusto, obraId: contextObraId } = useContextStore();

  useEffect(() => {
    if (funcionario?.obraAlocadoId && funcionario.obraAlocadoId !== contextObraId) {
      setObra(funcionario.obraAlocadoId);
    }
    if (funcionario?.centroCustoId) {
      setCentroCusto(funcionario.centroCustoId);
    }
  }, [funcionario?.obraAlocadoId, funcionario?.centroCustoId, contextObraId, setCentroCusto, setObra]);

  const isBaseRoute = location.pathname === `/rh/funcionarios/${funcId}`;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-b border-border-default bg-surface px-6 pb-0 pt-4">
        <div className="mb-2">
          <NavLink
            to="/rh/funcionarios"
            className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft size={12} />
            Voltar para lista
          </NavLink>
        </div>

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

      <div className="flex-1 overflow-auto">{isBaseRoute ? <FuncionarioVisaoGeral funcId={funcId} /> : <Outlet />}</div>
    </div>
  );
}

function FuncionarioVisaoGeral({ funcId }: { funcId: string | undefined }) {
  const { funcionario, resumoBlocos, alocacaoAtual, isLoading, isError } = useFuncionarioDetails(funcId);

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
      {alocacaoAtual && (
        <section className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-jogab-50 text-jogab-600">
              <MapPinned size={16} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Vínculo atual com obra</h3>
              <p className="text-xs text-gray-500">Resumo técnico para integração entre RH, Obra e centro de custo.</p>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <ResumoMeta label="Obra" value={alocacaoAtual.obraNome} />
            <ResumoMeta label="Centro de custo" value={alocacaoAtual.centroCustoNome ?? 'Não vinculado'} />
            <ResumoMeta label="Filial" value={alocacaoAtual.filialNome} />
            <ResumoMeta label="Gestor" value={alocacaoAtual.gestorNome ?? 'Não definido'} />
          </div>
          <div className="mt-4">
            <Link
              to={`/obras/${alocacaoAtual.obraId}/equipe`}
              className="inline-flex items-center gap-2 rounded-md border border-jogab-200 px-3 py-1.5 text-sm font-medium text-jogab-700 hover:bg-jogab-50"
            >
              <Building2 size={14} />
              Abrir equipe da obra
            </Link>
          </div>
        </section>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resumoBlocos.map((bloco) => (
          <ResumoBlocoCard key={bloco.titulo} bloco={bloco} />
        ))}
      </div>
    </MainContent>
  );
}

function ResumoMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-gray-100 bg-gray-50 p-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}

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
