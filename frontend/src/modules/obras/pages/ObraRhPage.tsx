import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EmptyState, MainContent } from '@/shared/components';
import { formatCurrency } from '@/shared/lib/utils';
import { useObraRh } from '../hooks';
import { ObraWorkspaceFilters, ObraWorkspaceResumoCard, ObraWorkspaceSectionHeader, ObraWorkspaceTable } from '../components';

const STATUS_OPTIONS = [
  { value: 'ativo', label: 'Ativo' },
  { value: 'ferias', label: 'Férias' },
  { value: 'afastado', label: 'Afastado' },
  { value: 'admissao_pendente', label: 'Admissão pendente' },
];

export function ObraRhPage() {
  const { obraId } = useParams<{ obraId: string }>();
  const { data, isLoading, isError, refetch } = useObraRh(obraId);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | undefined>(undefined);

  const filtered = useMemo(() => (data?.items ?? []).filter((item) => {
    const matchesSearch = !search.trim() || `${item.funcionarioNome} ${item.cargo} ${item.centroCustoNome}`.toLowerCase().includes(search.trim().toLowerCase());
    const matchesStatus = !status || item.status === status;
    return matchesSearch && matchesStatus;
  }), [data?.items, search, status]);

  return (
    <div className="flex flex-1 flex-col">
      <MainContent className="space-y-6">
        <ObraWorkspaceSectionHeader title="RH / FOPAG da Obra" description="Colaboradores da obra, centros de custo e leitura inicial do custo previsto de pessoal por competência." actionLabel="Abrir RH" actionHref="/rh/funcionarios" />
        <ObraWorkspaceFilters search={search} status={status} statusOptions={STATUS_OPTIONS} onSearchChange={setSearch} onStatusChange={setStatus} onClear={() => { setSearch(''); setStatus(undefined); }} hasActiveFilters={Boolean(search || status)} />
        {isLoading && <div className="py-12 text-center text-sm text-gray-500">Carregando RH da obra...</div>}
        {isError && <EmptyState title="Erro ao carregar RH da obra" description="Não foi possível carregar a leitura de RH/FOPAG desta obra." action={<button type="button" onClick={() => void refetch()} className="rounded-md bg-jogab-500 px-3 py-1.5 text-sm text-white">Tentar novamente</button>} />}
        {!isLoading && !isError && data && (
          <>
            <section className="grid gap-4 xl:grid-cols-3">{data.resumoCards.map((card) => <ObraWorkspaceResumoCard key={card.id} card={card} />)}</section>
            {filtered.length === 0 ? <EmptyState title="Nenhum colaborador encontrado" description="Não há colaboradores desta obra para o filtro atual." /> : <ObraWorkspaceTable columns={['Funcionário', 'Cargo', 'Centro de custo', 'Status', 'Salário', 'Custo previsto']} rows={filtered.map((item) => [item.funcionarioNome, item.cargo, item.centroCustoNome, STATUS_OPTIONS.find((option) => option.value === item.status)?.label ?? item.status, formatCurrency(item.salarioBase), formatCurrency(item.custoPessoalPrevisto)])} />}
          </>
        )}
      </MainContent>
    </div>
  );
}
