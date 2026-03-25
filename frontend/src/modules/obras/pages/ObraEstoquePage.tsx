import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EmptyState, MainContent } from '@/shared/components';
import { useObraEstoque } from '../hooks';
import type { ObraEstoqueItem, ObraWorkspaceResumoCard as ResumoCardData } from '../types';
import {
  ObraWorkspaceFilters,
  ObraWorkspaceResumoCard,
  ObraWorkspaceSectionHeader,
  ObraWorkspaceTable,
} from '../components';

const STATUS_OPTIONS = [
  { value: 'disponivel', label: 'Disponível' },
  { value: 'critico', label: 'Crítico' },
  { value: 'esgotado', label: 'Esgotado' },
];

export function ObraEstoquePage() {
  const { obraId } = useParams<{ obraId: string }>();
  const { data, isLoading, isError, refetch } = useObraEstoque(obraId);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | undefined>(undefined);

  const filtered = useMemo(() => {
    const items = data?.items ?? [];
    return items.filter((item: ObraEstoqueItem) => {
      const matchesSearch =
        !search.trim() ||
        `${item.codigo} ${item.descricao} ${item.almoxarife}`.toLowerCase().includes(search.trim().toLowerCase());
      const matchesStatus = !status || item.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [data?.items, search, status]);

  const hasActiveFilters = Boolean(search || status);

  return (
    <div className="flex flex-1 flex-col">
      <MainContent className="space-y-6">
        <ObraWorkspaceSectionHeader
          title="Estoque da Obra"
          description="Saldos, consumo mensal e status dos materiais no almoxarifado vinculado a esta obra."
          actionLabel="Ir para Estoque"
          actionHref="/estoque"
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

        {isLoading && <div className="py-12 text-center text-sm text-text-muted">Carregando estoque da obra...</div>}

        {isError && (
          <EmptyState
            title="Erro ao carregar estoque"
            description="Não foi possível carregar os dados de estoque vinculados a esta obra."
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
              {data.resumoCards.map((card: ResumoCardData) => (
                <ObraWorkspaceResumoCard key={card.id} card={card} />
              ))}
            </section>

            {filtered.length === 0 ? (
              <EmptyState
                title="Nenhum item encontrado"
                description={
                  hasActiveFilters
                    ? 'Nenhum item de estoque corresponde aos filtros selecionados.'
                    : 'Ainda não há itens de estoque cadastrados para esta obra.'
                }
              />
            ) : (
              <ObraWorkspaceTable
                columns={['Código', 'Descrição', 'Unidade', 'Saldo atual', 'Consumo/mês', 'Status', 'Almoxarife']}
                rows={filtered.map((item: ObraEstoqueItem) => [
                  item.codigo,
                  item.descricao,
                  item.unidade,
                  String(item.saldoAtual),
                  String(item.consumoMes),
                  STATUS_OPTIONS.find((opt) => opt.value === item.status)?.label ?? item.status,
                  item.almoxarife,
                ])}
              />
            )}
          </>
        )}
      </MainContent>
    </div>
  );
}
