import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EmptyState, MainContent } from '@/shared/components';
import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import { useFuncionarioProvisoes } from '../hooks';
import {
  FuncionarioWorkspaceFilters,
  FuncionarioWorkspaceResumoCard,
  FuncionarioWorkspaceSectionHeader,
  FuncionarioWorkspaceTable,
} from '../components';

const STATUS_OPTIONS = [
  { value: 'prevista', label: 'Prevista' },
  { value: 'consolidada', label: 'Consolidada' },
  { value: 'revertida', label: 'Revertida' },
];

const CATEGORIA_LABELS = {
  ferias: 'Férias',
  decimo_terceiro: '13º',
  fgts: 'FGTS',
  rescisao: 'Rescisão',
};

export function FuncionarioProvisoesPage() {
  const { funcId } = useParams<{ funcId: string }>();
  const { data, isLoading, isError, refetch } = useFuncionarioProvisoes(funcId);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | undefined>(undefined);

  const filtered = useMemo(() => {
    const items = data?.items ?? [];
    return items.filter((item) => {
      const matchesSearch =
        !search.trim() || `${item.categoria} ${item.observacao}`.toLowerCase().includes(search.trim().toLowerCase());
      const matchesStatus = !status || item.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [data?.items, search, status]);

  return (
    <div className="flex flex-1 flex-col">
      <MainContent className="space-y-6">
        <FuncionarioWorkspaceSectionHeader
          title="Provisões do Funcionário"
          description="Base trabalhista que alimenta FOPAG prevista e reflexos financeiros por competência."
          actionLabel="Abrir FOPAG"
          actionHref="/fopag"
        />

        <FuncionarioWorkspaceFilters
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

        {isLoading && (
          <div className="py-12 text-center text-sm text-text-muted">Carregando provisões do funcionário...</div>
        )}
        {isError && (
          <EmptyState
            title="Erro ao carregar provisões"
            description="Não foi possível carregar as provisões trabalhistas deste funcionário."
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
                <FuncionarioWorkspaceResumoCard key={card.id} card={card} />
              ))}
            </section>
            {filtered.length === 0 ? (
              <EmptyState
                title="Nenhuma provisão encontrada"
                description="Não há provisões deste funcionário para o filtro atual."
              />
            ) : (
              <FuncionarioWorkspaceTable
                columns={['Competência', 'Categoria', 'Status', 'Valor', 'Observação']}
                rows={filtered.map((item) => [
                  formatCompetencia(item.competencia),
                  CATEGORIA_LABELS[item.categoria],
                  STATUS_OPTIONS.find((option) => option.value === item.status)?.label ?? item.status,
                  formatCurrency(item.valor),
                  item.observacao,
                ])}
              />
            )}
          </>
        )}
      </MainContent>
    </div>
  );
}
