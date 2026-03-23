import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EmptyState, MainContent } from '@/shared/components';
import { formatCurrency } from '@/shared/lib/utils';
import { useObraEstoque } from '../hooks';
import { ObraWorkspaceFilters, ObraWorkspaceResumoCard, ObraWorkspaceSectionHeader, ObraWorkspaceTable } from '../components';

const STATUS_OPTIONS = [
  { value: 'disponivel', label: 'Disponível' },
  { value: 'baixo', label: 'Baixo' },
  { value: 'critico', label: 'Crítico' },
];

export function ObraEstoquePage() {
  const { obraId } = useParams<{ obraId: string }>();
  const { data, isLoading, isError, refetch } = useObraEstoque(obraId);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | undefined>(undefined);
  const filtered = useMemo(() => (data?.items ?? []).filter((item) => {
    const matchesSearch = !search.trim() || `${item.item} ${item.categoria}`.toLowerCase().includes(search.trim().toLowerCase());
    const matchesStatus = !status || item.status === status;
    return matchesSearch && matchesStatus;
  }), [data?.items, search, status]);

  return <div className="flex flex-1 flex-col"><MainContent className="space-y-6"><ObraWorkspaceSectionHeader title="Estoque da Obra" description="Saldo, criticidade e custo dos materiais principais vinculados à obra." actionLabel="Abrir Estoque" actionHref="/estoque" /><ObraWorkspaceFilters search={search} status={status} statusOptions={STATUS_OPTIONS} onSearchChange={setSearch} onStatusChange={setStatus} onClear={() => { setSearch(''); setStatus(undefined); }} hasActiveFilters={Boolean(search || status)} />{isLoading && <div className="py-12 text-center text-sm text-gray-500">Carregando estoque da obra...</div>}{isError && <EmptyState title="Erro ao carregar estoque" description="Não foi possível carregar o estoque desta obra." action={<button type="button" onClick={() => void refetch()} className="rounded-md bg-jogab-500 px-3 py-1.5 text-sm text-white">Tentar novamente</button>} />}{!isLoading && !isError && data && <><section className="grid gap-4 xl:grid-cols-3">{data.resumoCards.map((card) => <ObraWorkspaceResumoCard key={card.id} card={card} />)}</section>{filtered.length === 0 ? <EmptyState title="Nenhum item de estoque encontrado" description="Não há itens de estoque desta obra para o filtro atual." /> : <ObraWorkspaceTable columns={['Item', 'Categoria', 'Status', 'Saldo', 'Custo total']} rows={filtered.map((item) => [item.item, item.categoria, STATUS_OPTIONS.find((option) => option.value === item.status)?.label ?? item.status, String(item.saldo), formatCurrency(item.custoTotal)])} />}</>}</MainContent></div>;
}
