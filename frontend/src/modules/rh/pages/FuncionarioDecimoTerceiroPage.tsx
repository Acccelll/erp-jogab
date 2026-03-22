import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EmptyState, MainContent } from '@/shared/components';
import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import { useFuncionarioDecimoTerceiro } from '../hooks';
import {
  FuncionarioWorkspaceFilters,
  FuncionarioWorkspaceResumoCard,
  FuncionarioWorkspaceSectionHeader,
  FuncionarioWorkspaceTable,
} from '../components';

const STATUS_OPTIONS = [
  { value: 'previsto', label: 'Previsto' },
  { value: 'provisionado', label: 'Provisionado' },
  { value: 'pago', label: 'Pago' },
];

const ETAPA_LABELS = {
  adiantamento: 'Adiantamento',
  parcela_final: 'Parcela final',
  encargos: 'Encargos',
};

const ORIGEM_LABELS = {
  folha: 'Folha',
  provisao: 'Provisão',
  financeiro: 'Financeiro',
};

export function FuncionarioDecimoTerceiroPage() {
  const { funcId } = useParams<{ funcId: string }>();
  const { data, isLoading, isError, refetch } = useFuncionarioDecimoTerceiro(funcId);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | undefined>(undefined);

  const filtered = useMemo(() => {
    const items = data?.items ?? [];
    return items.filter((item) => {
      const matchesSearch = !search.trim() || `${item.etapa} ${item.origem}`.toLowerCase().includes(search.trim().toLowerCase());
      const matchesStatus = !status || item.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [data?.items, search, status]);

  return (
    <div className="flex flex-1 flex-col">
      <MainContent className="space-y-6">
        <FuncionarioWorkspaceSectionHeader
          title="13º Salário"
          description="Etapas do 13º salário com reflexo em provisões, folha prevista e desembolso financeiro."
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

        {isLoading && <div className="py-12 text-center text-sm text-gray-500">Carregando 13º salário...</div>}

        {isError && (
          <EmptyState
            title="Erro ao carregar 13º salário"
            description="Não foi possível carregar as etapas de 13º salário deste funcionário."
            action={<button type="button" onClick={() => void refetch()} className="rounded-md bg-jogab-500 px-3 py-1.5 text-sm text-white">Tentar novamente</button>}
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
              <EmptyState title="Nenhum registro encontrado" description="Não há registros de 13º salário para o filtro atual." />
            ) : (
              <FuncionarioWorkspaceTable
                columns={['Competência', 'Etapa', 'Status', 'Origem', 'Valor']}
                rows={filtered.map((item) => [
                  formatCompetencia(item.competencia),
                  ETAPA_LABELS[item.etapa],
                  STATUS_OPTIONS.find((option) => option.value === item.status)?.label ?? item.status,
                  ORIGEM_LABELS[item.origem],
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
