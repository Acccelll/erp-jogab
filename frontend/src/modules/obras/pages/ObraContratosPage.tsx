import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EmptyState, MainContent } from '@/shared/components';
import { formatCurrency } from '@/shared/lib/utils';
import { useObraContratos } from '../hooks';
import {
  ObraWorkspaceFilters,
  ObraWorkspaceResumoCard,
  ObraWorkspaceSectionHeader,
  ObraWorkspaceTable,
} from '../components';

const STATUS_OPTIONS = [
  { value: 'ativo', label: 'Ativo' },
  { value: 'em_negociacao', label: 'Em negociação' },
  { value: 'suspenso', label: 'Suspenso' },
  { value: 'encerrado', label: 'Encerrado' },
];

const TIPO_OPTIONS = [
  { value: 'cliente', label: 'Cliente' },
  { value: 'fornecedor', label: 'Fornecedor' },
  { value: 'subcontrato', label: 'Subcontrato' },
];

export function ObraContratosPage() {
  const { obraId } = useParams<{ obraId: string }>();
  const { data, isLoading, isError, refetch } = useObraContratos(obraId);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | undefined>(undefined);

  const filtered = useMemo(() => {
    const items = data?.items ?? [];
    return items.filter((item) => {
      const matchesSearch =
        !search.trim() ||
        `${item.codigo} ${item.objeto} ${item.contratado}`.toLowerCase().includes(search.trim().toLowerCase());
      const matchesStatus = !status || item.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [data?.items, search, status]);

  const hasActiveFilters = Boolean(search || status);

  return (
    <div className="flex flex-1 flex-col">
      <MainContent className="space-y-6">
        <ObraWorkspaceSectionHeader
          title="Contratos da Obra"
          description="Contratos com clientes, fornecedores e subcontratados — valores, aditivos e status atual."
          actionLabel="Ir para Compras"
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
          hasActiveFilters={hasActiveFilters}
        />

        {isLoading && (
          <div className="py-12 text-center text-sm text-gray-500">Carregando contratos da obra...</div>
        )}

        {isError && (
          <EmptyState
            title="Erro ao carregar contratos"
            description="Não foi possível carregar os contratos vinculados à obra."
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
                title="Nenhum contrato encontrado"
                description={
                  hasActiveFilters
                    ? 'Nenhum contrato corresponde aos filtros selecionados.'
                    : 'Ainda não há contratos vinculados a esta obra.'
                }
              />
            ) : (
              <ObraWorkspaceTable
                columns={['Código', 'Objeto', 'Contratado', 'Tipo', 'Valor contratado', 'Vigência', 'Status']}
                rows={filtered.map((item) => [
                  item.codigo,
                  item.objeto,
                  item.contratado,
                  TIPO_OPTIONS.find((opt) => opt.value === item.tipo)?.label ?? item.tipo,
                  formatCurrency(item.valorContrato + item.valorAditivos),
                  `${item.dataInicio} → ${item.dataFim}`,
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
