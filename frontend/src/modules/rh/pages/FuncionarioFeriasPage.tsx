import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EmptyState, MainContent } from '@/shared/components';
import { useFuncionarioFerias } from '../hooks';
import {
  FuncionarioWorkspaceFilters,
  FuncionarioWorkspaceResumoCard,
  FuncionarioWorkspaceSectionHeader,
  FuncionarioWorkspaceTable,
} from '../components';

const STATUS_OPTIONS = [
  { value: 'planejada', label: 'Planejada' },
  { value: 'em_gozo', label: 'Em gozo' },
  { value: 'concluida', label: 'Concluída' },
];

export function FuncionarioFeriasPage() {
  const { funcId } = useParams<{ funcId: string }>();
  const { data, isLoading, isError, refetch } = useFuncionarioFerias(funcId);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | undefined>(undefined);

  const filtered = useMemo(() => {
    const items = data?.items ?? [];
    return items.filter((item) => {
      const matchesSearch =
        !search.trim() || item.periodoAquisitivo.toLowerCase().includes(search.trim().toLowerCase());
      const matchesStatus = !status || item.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [data?.items, search, status]);

  return (
    <div className="flex flex-1 flex-col">
      <MainContent className="space-y-6">
        <FuncionarioWorkspaceSectionHeader
          title="Férias do Funcionário"
          description="Programação de férias e leitura operacional do impacto do afastamento nas frentes de obra."
          actionLabel="Abrir RH"
          actionHref="/rh/funcionarios"
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
          <div className="py-12 text-center text-sm text-text-muted">Carregando férias do funcionário...</div>
        )}

        {isError && (
          <EmptyState
            title="Erro ao carregar férias"
            description="Não foi possível carregar a programação de férias deste funcionário."
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
                title="Nenhum período encontrado"
                description="Não há períodos de férias para o filtro atual."
              />
            ) : (
              <FuncionarioWorkspaceTable
                columns={['Período aquisitivo', 'Status', 'Início', 'Fim', 'Saldo', 'Abono']}
                rows={filtered.map((item) => [
                  item.periodoAquisitivo,
                  STATUS_OPTIONS.find((option) => option.value === item.status)?.label ?? item.status,
                  item.inicioGozo ?? '—',
                  item.fimGozo ?? '—',
                  `${item.saldoDias} dias`,
                  item.abono ? 'Sim' : 'Não',
                ])}
              />
            )}
          </>
        )}
      </MainContent>
    </div>
  );
}
