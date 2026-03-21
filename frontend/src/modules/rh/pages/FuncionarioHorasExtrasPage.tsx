import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EmptyState, MainContent } from '@/shared/components';
import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import { useFuncionarioHorasExtras } from '../hooks';
import { FuncionarioWorkspaceFilters, FuncionarioWorkspaceResumoCard, FuncionarioWorkspaceSectionHeader, FuncionarioWorkspaceTable } from '../components';

const STATUS_OPTIONS = [
  { value: 'pendente_aprovacao', label: 'Pendente aprovação' },
  { value: 'aprovada', label: 'Aprovada' },
  { value: 'fechada_para_fopag', label: 'Fechada para FOPAG' },
  { value: 'paga', label: 'Paga' },
];

const TIPO_LABELS = {
  he_50: 'HE 50%',
  he_100: 'HE 100%',
  noturna: 'Noturna',
  domingo: 'Domingo',
  feriado: 'Feriado',
};

export function FuncionarioHorasExtrasPage() {
  const { funcId } = useParams<{ funcId: string }>();
  const { data, isLoading, isError, refetch } = useFuncionarioHorasExtras(funcId);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | undefined>(undefined);

  const filtered = useMemo(() => {
    const items = data?.items ?? [];
    return items.filter((item) => {
      const matchesSearch = !search.trim() || `${item.obraNome ?? ''} ${item.tipo}`.toLowerCase().includes(search.trim().toLowerCase());
      const matchesStatus = !status || item.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [data?.items, search, status]);

  return (
    <div className="flex flex-1 flex-col">
      <MainContent className="space-y-6">
        <FuncionarioWorkspaceSectionHeader
          title="Horas Extras do Funcionário"
          description="Eventos operacionais que impactam aprovação, fechamento e integração com FOPAG."
          actionLabel="Abrir Horas Extras"
          actionHref="/horas-extras"
        />

        <FuncionarioWorkspaceFilters search={search} status={status} statusOptions={STATUS_OPTIONS} onSearchChange={setSearch} onStatusChange={setStatus} onClear={() => { setSearch(''); setStatus(undefined); }} hasActiveFilters={Boolean(search || status)} />

        {isLoading && <div className="py-12 text-center text-sm text-gray-500">Carregando horas extras do funcionário...</div>}
        {isError && <EmptyState title="Erro ao carregar horas extras" description="Não foi possível carregar os eventos de horas extras deste funcionário." action={<button type="button" onClick={() => void refetch()} className="rounded-md bg-jogab-500 px-3 py-1.5 text-sm text-white">Tentar novamente</button>} />}

        {!isLoading && !isError && data && (
          <>
            <section className="grid gap-4 xl:grid-cols-3">
              {data.resumoCards.map((card) => <FuncionarioWorkspaceResumoCard key={card.id} card={card} />)}
            </section>
            {filtered.length === 0 ? (
              <EmptyState title="Nenhum lançamento encontrado" description="Não há horas extras deste funcionário para o filtro atual." />
            ) : (
              <FuncionarioWorkspaceTable
                columns={['Competência', 'Obra', 'Tipo', 'Status', 'Horas', 'Valor estimado']}
                rows={filtered.map((item) => [formatCompetencia(item.competencia), item.obraNome ?? 'Sem obra', TIPO_LABELS[item.tipo], STATUS_OPTIONS.find((option) => option.value === item.status)?.label ?? item.status, `${item.quantidadeHoras}h`, formatCurrency(item.valorEstimado)])}
              />
            )}
          </>
        )}
      </MainContent>
    </div>
  );
}
