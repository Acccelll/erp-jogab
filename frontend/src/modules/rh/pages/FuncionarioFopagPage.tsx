import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EmptyState, MainContent } from '@/shared/components';
import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import { useFuncionarioFopag } from '../hooks';
import {
  FuncionarioWorkspaceFilters,
  FuncionarioWorkspaceResumoCard,
  FuncionarioWorkspaceSectionHeader,
  FuncionarioWorkspaceTable,
} from '../components';

const STATUS_OPTIONS = [
  { value: 'previsto', label: 'Previsto' },
  { value: 'consolidado', label: 'Consolidado' },
  { value: 'enviado_financeiro', label: 'Enviado ao financeiro' },
];

const TIPO_LABELS = {
  provento: 'Provento',
  desconto: 'Desconto',
  base: 'Base',
};

const ORIGEM_LABELS = {
  cadastro: 'Cadastro',
  horas_extras: 'Horas extras',
  provisao: 'Provisão',
  manual: 'Manual',
};

export function FuncionarioFopagPage() {
  const { funcId } = useParams<{ funcId: string }>();
  const { data, isLoading, isError, refetch } = useFuncionarioFopag(funcId);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | undefined>(undefined);

  const filtered = useMemo(() => {
    const items = data?.items ?? [];
    return items.filter((item) => {
      const matchesSearch =
        !search.trim() ||
        `${item.evento} ${item.origem} ${item.tipo}`.toLowerCase().includes(search.trim().toLowerCase());
      const matchesStatus = !status || item.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [data?.items, search, status]);

  return (
    <div className="flex flex-1 flex-col">
      <MainContent className="space-y-6">
        <FuncionarioWorkspaceSectionHeader
          title="FOPAG do Funcionário"
          description="Eventos de folha previstos e consolidados por competência, incluindo origens de RH e Horas Extras."
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
          <div className="py-12 text-center text-sm text-text-muted">Carregando eventos de FOPAG do funcionário...</div>
        )}
        {isError && (
          <EmptyState
            title="Erro ao carregar FOPAG"
            description="Não foi possível carregar os eventos de folha deste funcionário."
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
                title="Nenhum evento encontrado"
                description="Não há eventos de FOPAG deste funcionário para o filtro atual."
              />
            ) : (
              <FuncionarioWorkspaceTable
                columns={['Competência', 'Evento', 'Tipo', 'Origem', 'Status', 'Valor']}
                rows={filtered.map((item) => [
                  formatCompetencia(item.competencia),
                  item.evento,
                  TIPO_LABELS[item.tipo],
                  ORIGEM_LABELS[item.origem],
                  STATUS_OPTIONS.find((option) => option.value === item.status)?.label ?? item.status,
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
