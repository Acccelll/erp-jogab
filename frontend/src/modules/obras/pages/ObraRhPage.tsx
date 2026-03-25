import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EmptyState, MainContent } from '@/shared/components';
import { useObraRh } from '../hooks';
import {
  ObraWorkspaceFilters,
  ObraWorkspaceResumoCard,
  ObraWorkspaceSectionHeader,
  ObraWorkspaceTable,
} from '../components';

const STATUS_OPTIONS = [
  { value: 'ativa', label: 'Ativa' },
  { value: 'planejada', label: 'Planejada' },
  { value: 'encerrada', label: 'Encerrada' },
];

export function ObraRhPage() {
  const { obraId } = useParams<{ obraId: string }>();
  const { data, isLoading, isError, refetch } = useObraRh(obraId);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | undefined>(undefined);

  const filtered = useMemo(() => {
    const items = data?.items ?? [];
    return items.filter((item) => {
      const matchesSearch =
        !search.trim() ||
        `${item.funcionarioNome} ${item.funcao} ${item.centroCustoNome}`
          .toLowerCase()
          .includes(search.trim().toLowerCase());
      const matchesStatus = !status || item.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [data?.items, search, status]);

  const hasActiveFilters = Boolean(search || status);

  return (
    <div className="flex flex-1 flex-col">
      <MainContent className="space-y-6">
        <ObraWorkspaceSectionHeader
          title="RH da Obra"
          description="Colaboradores alocados nesta obra com seus vínculos de centro de custo e dados trabalhistas no módulo de RH."
          actionLabel="Ir para RH"
          actionHref="/rh/funcionarios"
        />

        <ObraWorkspaceFilters
          search={search}
          status={status}
          statusOptions={STATUS_OPTIONS}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onClear={() => {
            setSearch('');
            setStatus(undefined);
          }}
          hasActiveFilters={hasActiveFilters}
        />

        {isLoading && (
          <div className="py-12 text-center text-sm text-text-muted">Carregando dados de RH da obra...</div>
        )}

        {isError && (
          <EmptyState
            title="Erro ao carregar RH da obra"
            description="Não foi possível carregar os dados de RH vinculados a esta obra."
            action={
              <button
                type="button"
                onClick={() => void refetch()}
                className="rounded-md bg-jogab-700 px-3 py-1.5 text-sm text-white"
              >
                Tentar novamente
              </button>
            }
          />
        )}

        {!isLoading && !isError && data && (
          <>
            <section className="grid gap-4 xl:grid-cols-3">
              {data.resumoCards.map((card) => (
                <ObraWorkspaceResumoCard key={card.id} card={card} />
              ))}
            </section>

            {filtered.length === 0 ? (
              <EmptyState
                title="Nenhum colaborador encontrado"
                description={
                  hasActiveFilters
                    ? 'Nenhum colaborador corresponde aos filtros selecionados.'
                    : 'Ainda não há colaboradores alocados a esta obra.'
                }
              />
            ) : (
              <ObraWorkspaceTable
                columns={['Colaborador', 'Função', 'Centro de custo', 'Rateio', 'Status', 'Ver no RH']}
                rows={filtered.map((item) => [
                  item.funcionarioNome,
                  item.funcao,
                  item.centroCustoNome,
                  `${item.percentual}%`,
                  STATUS_OPTIONS.find((opt) => opt.value === item.status)?.label ?? item.status,
                  <Link
                    key={`${item.id}-link`}
                    to={`/rh/funcionarios/${item.funcionarioId}`}
                    className="text-sm font-medium text-jogab-700 hover:underline"
                  >
                    Abrir ficha
                  </Link>,
                ])}
              />
            )}
          </>
        )}
      </MainContent>
    </div>
  );
}
