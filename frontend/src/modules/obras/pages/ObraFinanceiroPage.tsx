import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EmptyState, MainContent } from '@/shared/components';
import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import { useObraFinanceiro } from '../hooks';
import {
  ObraWorkspaceFilters,
  ObraWorkspaceResumoCard,
  ObraWorkspaceSectionHeader,
  ObraWorkspaceTable,
} from '../components';

const STATUS_OPTIONS = [
  { value: 'programado', label: 'Programado' },
  { value: 'previsto', label: 'Previsto' },
  { value: 'pago', label: 'Pago' },
  { value: 'recebido', label: 'Recebido' },
  { value: 'vencido', label: 'Vencido' },
];

export function ObraFinanceiroPage() {
  const { obraId } = useParams<{ obraId: string }>();
  const { data, isLoading, isError, refetch } = useObraFinanceiro(obraId);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | undefined>(undefined);

  const filtered = useMemo(() => {
    const items = data?.items ?? [];
    return items.filter((item) => {
      const matchesSearch =
        !search.trim() ||
        `${item.codigo} ${item.descricao} ${item.tipo}`.toLowerCase().includes(search.trim().toLowerCase());
      const matchesStatus = !status || item.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [data?.items, search, status]);

  return (
    <div className="flex flex-1 flex-col">
      <MainContent className="space-y-6">
        <ObraWorkspaceSectionHeader
          title="Financeiro da Obra"
          description="Títulos a pagar e a receber vinculados à obra, preservando leitura de competência e saldo projetado."
          actionLabel="Abrir Financeiro"
          actionHref="/financeiro"
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

        {isLoading && <div className="py-12 text-center text-sm text-text-muted">Carregando financeiro da obra...</div>}
        {isError && (
          <EmptyState
            title="Erro ao carregar financeiro"
            description="Não foi possível carregar os títulos desta obra."
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
                title="Nenhum título encontrado"
                description="Não há títulos desta obra para o filtro atual."
              />
            ) : (
              <ObraWorkspaceTable
                columns={['Código', 'Descrição', 'Tipo', 'Status', 'Competência', 'Valor']}
                rows={filtered.map((item) => [
                  item.codigo,
                  item.descricao,
                  item.tipo === 'pagar' ? 'A pagar' : 'A receber',
                  STATUS_OPTIONS.find((option) => option.value === item.status)?.label ?? item.status,
                  formatCompetencia(item.competencia),
                  formatCurrency(item.valor),
                ])}
              />
            )}
          </>
        )}
      </MainContent>
    </div>
  );
}
