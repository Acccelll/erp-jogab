import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EmptyState, MainContent } from '@/shared/components';
import { formatCurrency } from '@/shared/lib/utils';
import { useObraCompras } from '../hooks';
import {
  ObraWorkspaceFilters,
  ObraWorkspaceResumoCard,
  ObraWorkspaceSectionHeader,
  ObraWorkspaceTable,
} from '../components';

const STATUS_OPTIONS = [
  { value: 'em_cotacao', label: 'Em cotação' },
  { value: 'pedido_emitido', label: 'Pedido emitido' },
  { value: 'aguardando_fiscal', label: 'Aguardando fiscal' },
  { value: 'recebimento_parcial', label: 'Recebimento parcial' },
];

export function ObraComprasPage() {
  const { obraId } = useParams<{ obraId: string }>();
  const { data, isLoading, isError, refetch } = useObraCompras(obraId);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | undefined>(undefined);

  const filtered = useMemo(() => {
    const items = data?.items ?? [];
    return items.filter((item) => {
      const matchesSearch =
        !search.trim() ||
        `${item.codigo} ${item.objeto} ${item.fornecedor}`.toLowerCase().includes(search.trim().toLowerCase());
      const matchesStatus = !status || item.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [data?.items, search, status]);

  return (
    <div className="flex flex-1 flex-col">
      <MainContent className="space-y-6">
        <ObraWorkspaceSectionHeader
          title="Compras da Obra"
          description="Pipeline de compras monitorando cotação, pedido, recebimento e impacto fiscal da obra."
          actionLabel="Abrir Compras"
          actionHref="/compras"
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

        {isLoading && <div className="py-12 text-center text-sm text-text-muted">Carregando compras da obra...</div>}
        {isError && (
          <EmptyState
            title="Erro ao carregar compras"
            description="Não foi possível carregar o pipeline de compras desta obra."
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
                title="Nenhum item de compra encontrado"
                description="Não há compras desta obra para o filtro atual."
              />
            ) : (
              <ObraWorkspaceTable
                columns={['Código', 'Objeto', 'Fornecedor', 'Status', 'Valor', 'Entrega']}
                rows={filtered.map((item) => [
                  item.codigo,
                  item.objeto,
                  item.fornecedor,
                  STATUS_OPTIONS.find((option) => option.value === item.status)?.label ?? item.status,
                  formatCurrency(item.valor),
                  item.previsaoEntrega,
                ])}
              />
            )}
          </>
        )}
      </MainContent>
    </div>
  );
}
