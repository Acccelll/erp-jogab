import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EmptyState, MainContent } from '@/shared/components';
import { formatCurrency } from '@/shared/lib/utils';
import { useObraMedicoes } from '../hooks';
import type { ObraMedicaoItem, ObraWorkspaceResumoCard as ResumoCardData } from '../types';
import {
  ObraWorkspaceFilters,
  ObraWorkspaceResumoCard,
  ObraWorkspaceSectionHeader,
  ObraWorkspaceTable,
} from '../components';

const STATUS_OPTIONS = [
  { value: 'prevista', label: 'Prevista' },
  { value: 'em_apuracao', label: 'Em apuração' },
  { value: 'aprovada', label: 'Aprovada' },
  { value: 'faturada', label: 'Faturada' },
];

export function ObraMedicoesPage() {
  const { obraId } = useParams<{ obraId: string }>();
  const { data, isLoading, isError, refetch } = useObraMedicoes(obraId);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | undefined>(undefined);

  const filtered = useMemo(() => {
    const items = data?.items ?? [];
    return items.filter((item: ObraMedicaoItem) => {
      const matchesSearch =
        !search.trim() ||
        `${item.codigo} ${item.descricao} ${item.responsavel}`.toLowerCase().includes(search.trim().toLowerCase());
      const matchesStatus = !status || item.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [data?.items, search, status]);

  const hasActiveFilters = Boolean(search || status);

  return (
    <div className="flex flex-1 flex-col">
      <MainContent className="space-y-6">
        <ObraWorkspaceSectionHeader
          title="Medições da Obra"
          description="Acompanhamento de medições contratuais, aprovações e faturamento por competência."
          actionLabel="Ir para Medições"
          actionHref="/medicoes"
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
          <div className="py-12 text-center text-sm text-gray-500">Carregando medições da obra...</div>
        )}

        {isError && (
          <EmptyState
            title="Erro ao carregar medições"
            description="Não foi possível carregar as medições vinculadas a esta obra."
            action={
              <button
                type="button"
                onClick={() => void refetch()}
                className="rounded-md bg-jogab-500 px-3 py-1.5 text-sm text-white"
              >
                Tentar novamente
              </button>
            }
          />
        )}

        {!isLoading && !isError && data && (
          <>
            <section className="grid gap-4 xl:grid-cols-3">
              {data.resumoCards.map((card: ResumoCardData) => (
                <ObraWorkspaceResumoCard key={card.id} card={card} />
              ))}
            </section>

            {filtered.length === 0 ? (
              <EmptyState
                title="Nenhuma medição encontrada"
                description={
                  hasActiveFilters
                    ? 'Nenhuma medição corresponde aos filtros selecionados.'
                    : 'Ainda não há medições cadastradas para esta obra.'
                }
              />
            ) : (
              <ObraWorkspaceTable
                columns={['Código', 'Descrição', 'Competência', 'Percentual medido', 'Valor', 'Responsável', 'Status']}
                rows={filtered.map((item: ObraMedicaoItem) => [
                  item.codigo,
                  item.descricao,
                  item.competencia,
                  `${item.percentualMedido}%`,
                  formatCurrency(item.valorMedido),
                  item.responsavel,
                  STATUS_OPTIONS.find((opt) => opt.value === item.status)?.label ?? item.status,
                ])}
              />
            )}
          </>
        )}
      </MainContent>
    </div>
  );
}
