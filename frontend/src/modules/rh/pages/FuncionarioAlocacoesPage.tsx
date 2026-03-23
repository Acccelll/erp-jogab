import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EmptyState, MainContent } from '@/shared/components';
import { useDrawerStore } from '@/shared/stores';
import { useFuncionarioAlocacoes } from '../hooks';
import {
  AlocacaoMutationDrawerForm,
  FuncionarioWorkspaceFilters,
  FuncionarioWorkspaceResumoCard,
  FuncionarioWorkspaceSectionHeader,
  FuncionarioWorkspaceTable,
} from '../components';

const STATUS_OPTIONS = [
  { value: 'ativa', label: 'Ativa' },
  { value: 'planejada', label: 'Planejada' },
  { value: 'encerrada', label: 'Encerrada' },
];

export function FuncionarioAlocacoesPage() {
  const { funcId } = useParams<{ funcId: string }>();
  const openDrawer = useDrawerStore((state) => state.openDrawer);
  const { data, isLoading, isError, refetch } = useFuncionarioAlocacoes(funcId);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | undefined>(undefined);

  const filtered = useMemo(() => {
    const items = data?.items ?? [];
    return items.filter((item) => {
      const matchesSearch = !search.trim() || `${item.obraNome} ${item.funcao} ${item.centroCustoNome}`.toLowerCase().includes(search.trim().toLowerCase());
      const matchesStatus = !status || item.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [data?.items, search, status]);

  const openCreateDrawer = () => {
    if (!funcId) return;
    openDrawer({
      title: 'Nova alocação do funcionário',
      content: <AlocacaoMutationDrawerForm funcionarioId={funcId} />,
      width: 'max-w-3xl',
    });
  };

  const openEditDrawer = (alocacaoId: string) => {
    if (!funcId) return;
    openDrawer({
      title: 'Editar alocação',
      content: <AlocacaoMutationDrawerForm funcionarioId={funcId} alocacaoId={alocacaoId} />,
      width: 'max-w-3xl',
    });
  };

  return (
    <div className="flex flex-1 flex-col">
      <MainContent className="space-y-6">
        <FuncionarioWorkspaceSectionHeader
          title="Alocações do Funcionário"
          description="Histórico de apropriação em obras e centros de custo, preservando a centralidade da obra."
          actionLabel="Nova alocação"
          actionHref={undefined}
          action={
            <button type="button" onClick={openCreateDrawer} className="rounded-md bg-jogab-500 px-3 py-2 text-sm font-medium text-white">
              Nova alocação
            </button>
          }
        />

        <FuncionarioWorkspaceFilters search={search} status={status} statusOptions={STATUS_OPTIONS} onSearchChange={setSearch} onStatusChange={setStatus} onClear={() => { setSearch(''); setStatus(undefined); }} hasActiveFilters={Boolean(search || status)} />

        {isLoading && <div className="py-12 text-center text-sm text-gray-500">Carregando alocações do funcionário...</div>}
        {isError && <EmptyState title="Erro ao carregar alocações" description="Não foi possível carregar as alocações deste funcionário." action={<button type="button" onClick={() => void refetch()} className="rounded-md bg-jogab-500 px-3 py-1.5 text-sm text-white">Tentar novamente</button>} />}

        {!isLoading && !isError && data && (
          <>
            <section className="grid gap-4 xl:grid-cols-3">
              {data.resumoCards.map((card) => <FuncionarioWorkspaceResumoCard key={card.id} card={card} />)}
            </section>
            {filtered.length === 0 ? (
              <EmptyState title="Nenhuma alocação encontrada" description="Não há alocações deste funcionário para o filtro atual." action={<button type="button" onClick={openCreateDrawer} className="rounded-md bg-jogab-500 px-3 py-2 text-sm font-medium text-white">Criar alocação</button>} />
            ) : (
              <FuncionarioWorkspaceTable
                columns={['Obra', 'Função', 'Centro de custo', 'Início', 'Fim', 'Rateio', 'Status', 'Ações']}
                rows={filtered.map((item) => [
                  <Link key={`${item.id}-obra`} to={`/obras/${item.obraId}`} className="font-medium text-jogab-700 hover:underline">{item.obraNome}</Link>,
                  item.funcao,
                  item.centroCustoNome,
                  item.periodoInicio,
                  item.periodoFim ?? 'Atual',
                  `${item.percentual}%`,
                  STATUS_OPTIONS.find((option) => option.value === item.status)?.label ?? item.status,
                  <div key={`${item.id}-acoes`} className="flex items-center gap-2">
                    <button type="button" onClick={() => openEditDrawer(item.id)} className="rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700">
                      Editar
                    </button>
                    <Link to={`/obras/${item.obraId}/equipe`} className="text-xs font-medium text-jogab-700 hover:underline">
                      Ver na obra
                    </Link>
                  </div>,
                ])}
              />
            )}
          </>
        )}
      </MainContent>
    </div>
  );
}
