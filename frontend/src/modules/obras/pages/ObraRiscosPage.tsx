import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EmptyState, MainContent } from '@/shared/components';
import { useObraRiscos } from '../hooks';
import {
  ObraWorkspaceFilters,
  ObraWorkspaceResumoCard,
  ObraWorkspaceSectionHeader,
  ObraWorkspaceTable,
} from '../components';

const STATUS_OPTIONS = [
  { value: 'identificado', label: 'Identificado' },
  { value: 'em_mitigacao', label: 'Em mitigação' },
  { value: 'mitigado', label: 'Mitigado' },
  { value: 'materializado', label: 'Materializado' },
];

const PROBABILIDADE_LABELS: Record<string, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
};

const IMPACTO_LABELS: Record<string, string> = {
  baixo: 'Baixo',
  medio: 'Médio',
  alto: 'Alto',
};

export function ObraRiscosPage() {
  const { obraId } = useParams<{ obraId: string }>();
  const { data, isLoading, isError, refetch } = useObraRiscos(obraId);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | undefined>(undefined);

  const filtered = useMemo(() => {
    const items = data?.items ?? [];
    return items.filter((item) => {
      const matchesSearch =
        !search.trim() ||
        `${item.codigo} ${item.titulo} ${item.categoria} ${item.responsavel}`.toLowerCase().includes(search.trim().toLowerCase());
      const matchesStatus = !status || item.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [data?.items, search, status]);

  const hasActiveFilters = Boolean(search || status);

  return (
    <div className="flex flex-1 flex-col">
      <MainContent className="space-y-6">
        <ObraWorkspaceSectionHeader
          title="Riscos da Obra"
          description="Matriz de riscos e oportunidades com priorização por probabilidade, impacto e status de mitigação."
          actionLabel="Abrir Obras"
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

        {isLoading && (
          <div className="py-12 text-center text-sm text-gray-500">Carregando matriz de riscos...</div>
        )}

        {isError && (
          <EmptyState
            title="Erro ao carregar riscos"
            description="Não foi possível carregar a matriz de riscos desta obra."
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
              {data.resumoCards.map((card) => (
                <ObraWorkspaceResumoCard key={card.id} card={card} />
              ))}
            </section>

            {filtered.length === 0 ? (
              <EmptyState
                title="Nenhum risco encontrado"
                description={
                  hasActiveFilters
                    ? 'Nenhum risco corresponde aos filtros selecionados.'
                    : 'Ainda não há riscos identificados para esta obra.'
                }
              />
            ) : (
              <ObraWorkspaceTable
                columns={['Código', 'Título', 'Categoria', 'Probabilidade', 'Impacto', 'Responsável', 'Status']}
                rows={filtered.map((item) => [
                  item.codigo,
                  item.titulo,
                  item.categoria,
                  PROBABILIDADE_LABELS[item.probabilidade] ?? item.probabilidade,
                  IMPACTO_LABELS[item.impacto] ?? item.impacto,
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
