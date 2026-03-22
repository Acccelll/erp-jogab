import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EmptyState, MainContent } from '@/shared/components';
import { useFuncionarioAlocacoes } from '../hooks';
import { FuncionarioWorkspaceFilters, FuncionarioWorkspaceResumoCard, FuncionarioWorkspaceSectionHeader, FuncionarioWorkspaceTable } from '../components';

const STATUS_OPTIONS = [
  { value: 'ativa', label: 'Ativa' },
  { value: 'planejada', label: 'Planejada' },
  { value: 'encerrada', label: 'Encerrada' },
];

export function FuncionarioAlocacoesPage() {
  const { funcId } = useParams<{ funcId: string }>();
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

  return (
    <div className="flex flex-1 flex-col">
      <MainContent className="space-y-6">
        <FuncionarioWorkspaceSectionHeader
          title="Alocações do Funcionário"
          description="Histórico de apropriação em obras e centros de custo, preservando a centralidade da obra."
          actionLabel="Abrir Obras"
          actionHref="/obras"
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
              <EmptyState title="Nenhuma alocação encontrada" description="Não há alocações deste funcionário para o filtro atual." />
            ) : (
              <FuncionarioWorkspaceTable
                columns={['Obra', 'Função', 'Centro de custo', 'Início', 'Fim', 'Rateio', 'Status']}
                rows={filtered.map((item) => [
                  <Link key={`${item.id}-obra`} to={`/obras/${item.obraId}`} className="font-medium text-jogab-700 hover:underline">{item.obraNome}</Link>,
                  item.funcao,
                  item.centroCustoNome,
                  item.periodoInicio,
                  item.periodoFim ?? 'Atual',
                  `${item.percentual}%`,
                  STATUS_OPTIONS.find((option) => option.value === item.status)?.label ?? item.status,
                ])}
              />
            )}
          </>
        )}
      </MainContent>
    </div>
  );
}
