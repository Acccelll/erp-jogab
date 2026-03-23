import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EmptyState, MainContent } from '@/shared/components';
import { useObraRiscos } from '../hooks';
import { ObraWorkspaceFilters, ObraWorkspaceResumoCard, ObraWorkspaceSectionHeader, ObraWorkspaceTable } from '../components';

const STATUS_OPTIONS = [
  { value: 'aberto', label: 'Aberto' },
  { value: 'monitorado', label: 'Monitorado' },
  { value: 'mitigado', label: 'Mitigado' },
];

export function ObraRiscosPage() {
  const { obraId } = useParams<{ obraId: string }>();
  const { data, isLoading, isError, refetch } = useObraRiscos(obraId);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | undefined>(undefined);
  const filtered = useMemo(() => (data?.items ?? []).filter((item) => {
    const matchesSearch = !search.trim() || `${item.titulo} ${item.categoria} ${item.responsavel}`.toLowerCase().includes(search.trim().toLowerCase());
    const matchesStatus = !status || item.status === status;
    return matchesSearch && matchesStatus;
  }), [data?.items, search, status]);

  return (
    <div className="flex flex-1 flex-col">
      <MainContent className="space-y-6">
        <ObraWorkspaceSectionHeader title="Riscos e Pendências" description="Matriz inicial de riscos operacionais, financeiros e de prazo da obra." actionLabel="Abrir obra" actionHref="/obras" />
        <ObraWorkspaceFilters search={search} status={status} statusOptions={STATUS_OPTIONS} onSearchChange={setSearch} onStatusChange={setStatus} onClear={() => { setSearch(''); setStatus(undefined); }} hasActiveFilters={Boolean(search || status)} />
        {isLoading && <div className="py-12 text-center text-sm text-gray-500">Carregando riscos da obra...</div>}
        {isError && <EmptyState title="Erro ao carregar riscos" description="Não foi possível carregar os riscos e pendências desta obra." action={<button type="button" onClick={() => void refetch()} className="rounded-md bg-jogab-500 px-3 py-1.5 text-sm text-white">Tentar novamente</button>} />}
        {!isLoading && !isError && data && (<><section className="grid gap-4 xl:grid-cols-3">{data.resumoCards.map((card) => <ObraWorkspaceResumoCard key={card.id} card={card} />)}</section>{filtered.length === 0 ? <EmptyState title="Nenhum risco encontrado" description="Não há riscos desta obra para o filtro atual." /> : <ObraWorkspaceTable columns={['Título', 'Categoria', 'Severidade', 'Status', 'Responsável']} rows={filtered.map((item) => [item.titulo, item.categoria, item.severidade, STATUS_OPTIONS.find((option) => option.value === item.status)?.label ?? item.status, item.responsavel])} />}</>)}
      </MainContent>
    </div>
  );
}
