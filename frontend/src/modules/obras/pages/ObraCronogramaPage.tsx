import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EmptyState, MainContent } from '@/shared/components';
import { useObraCronograma } from '../hooks';
import {
  ObraWorkspaceFilters,
  ObraWorkspaceResumoCard,
  ObraWorkspaceSectionHeader,
  ObraWorkspaceTable,
} from '../components';

const STATUS_OPTIONS = [
  { value: 'em_dia', label: 'Em dia' },
  { value: 'atencao', label: 'Atenção' },
  { value: 'atrasada', label: 'Atrasada' },
  { value: 'concluida', label: 'Concluída' },
];

export function ObraCronogramaPage() {
  const { obraId } = useParams<{ obraId: string }>();
  const { data, isLoading, isError, refetch } = useObraCronograma(obraId);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | undefined>(undefined);

  const filtered = useMemo(() => {
    const items = data?.items ?? [];
    return items.filter((item) => {
      const matchesSearch =
        !search.trim() || `${item.etapa} ${item.responsavel}`.toLowerCase().includes(search.trim().toLowerCase());
      const matchesStatus = !status || item.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [data?.items, search, status]);

  const hasActiveFilters = Boolean(search || status);

  return (
    <div className="flex flex-1 flex-col">
      <MainContent className="space-y-6">
        <ObraWorkspaceSectionHeader
          title="Cronograma da Obra"
          description="Marcos físicos prioritários com leitura de avanço, responsável e risco de prazo."
          actionLabel="Abrir módulo Obras"
          actionHref="/obras"
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

        {isLoading && <div className="py-12 text-center text-sm text-text-muted">Carregando cronograma da obra...</div>}

        {isError && (
          <EmptyState
            title="Erro ao carregar cronograma"
            description="Não foi possível carregar as etapas prioritárias desta obra."
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
                title="Nenhuma etapa encontrada"
                description={
                  hasActiveFilters
                    ? 'Nenhuma etapa corresponde aos filtros selecionados.'
                    : 'Ainda não há etapas de cronograma mapeadas para esta obra.'
                }
              />
            ) : (
              <ObraWorkspaceTable
                columns={['Etapa', 'Responsável', 'Início previsto', 'Fim previsto', 'Avanço', 'Status']}
                rows={filtered.map((item) => [
                  item.etapa,
                  item.responsavel,
                  item.inicioPrevisto,
                  item.fimPrevisto,
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
