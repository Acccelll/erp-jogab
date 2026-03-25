import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EmptyState, MainContent } from '@/shared/components';
import { useObraEquipe } from '../hooks';
import {
  ObraWorkspaceFilters,
  ObraWorkspaceResumoCard,
  ObraWorkspaceSectionHeader,
  ObraWorkspaceTable,
} from '../components';

const STATUS_OPTIONS = [
  { value: 'alocado', label: 'Alocado' },
  { value: 'ferias', label: 'Férias' },
  { value: 'desmobilizando', label: 'Desmobilizando' },
];

export function ObraEquipePage() {
  const { obraId } = useParams<{ obraId: string }>();
  const { data, isLoading, isError, refetch } = useObraEquipe(obraId);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | undefined>(undefined);

  const filtered = useMemo(() => {
    const items = data?.items ?? [];
    return items.filter((item) => {
      const matchesSearch =
        !search.trim() ||
        `${item.nome} ${item.funcao} ${item.equipe}`.toLowerCase().includes(search.trim().toLowerCase());
      const matchesStatus = !status || item.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [data?.items, search, status]);

  return (
    <div className="flex flex-1 flex-col">
      <MainContent className="space-y-6">
        <ObraWorkspaceSectionHeader
          title="Equipe da Obra"
          description="Pessoas-chave, alocação operacional e leitura rápida de disponibilidade da equipe no canteiro."
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
          hasActiveFilters={Boolean(search || status)}
        />

        {isLoading && <div className="py-12 text-center text-sm text-text-muted">Carregando equipe da obra...</div>}
        {isError && (
          <EmptyState
            title="Erro ao carregar equipe"
            description="Não foi possível carregar a equipe vinculada à obra."
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
                title="Nenhum membro encontrado"
                description="Não há pessoas correspondentes ao filtro atual nesta obra."
              />
            ) : (
              <ObraWorkspaceTable
                columns={['Nome', 'Função', 'Equipe', 'Status', 'Jornada']}
                rows={filtered.map((item) => [
                  item.nome,
                  item.funcao,
                  item.equipe,
                  STATUS_OPTIONS.find((option) => option.value === item.status)?.label ?? item.status,
                  item.jornada,
                ])}
              />
            )}
          </>
        )}
      </MainContent>
    </div>
  );
}
