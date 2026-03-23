import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EmptyState, MainContent } from '@/shared/components';
import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import { useObraMedicoes } from '../hooks';
import { ObraWorkspaceFilters, ObraWorkspaceResumoCard, ObraWorkspaceSectionHeader, ObraWorkspaceTable } from '../components';

const STATUS_OPTIONS = [
  { value: 'em_preparacao', label: 'Em preparação' },
  { value: 'em_aprovacao', label: 'Em aprovação' },
  { value: 'faturada', label: 'Faturada' },
];

export function ObraMedicoesPage() {
  const { obraId } = useParams<{ obraId: string }>();
  const { data, isLoading, isError, refetch } = useObraMedicoes(obraId);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | undefined>(undefined);
  const filtered = useMemo(() => (data?.items ?? []).filter((item) => {
    const matchesSearch = !search.trim() || `${item.competencia} ${item.etapa}`.toLowerCase().includes(search.trim().toLowerCase());
    const matchesStatus = !status || item.status === status;
    return matchesSearch && matchesStatus;
  }), [data?.items, search, status]);

  return (
    <div className="flex flex-1 flex-col">
      <MainContent className="space-y-6">
        <ObraWorkspaceSectionHeader title="Medições da Obra" description="Produção executada, aprovação e preparação de faturamento por competência." actionLabel="Abrir Medições" actionHref="/medicoes" />
        <ObraWorkspaceFilters search={search} status={status} statusOptions={STATUS_OPTIONS} onSearchChange={setSearch} onStatusChange={setStatus} onClear={() => { setSearch(''); setStatus(undefined); }} hasActiveFilters={Boolean(search || status)} />
        {isLoading && <div className="py-12 text-center text-sm text-gray-500">Carregando medições da obra...</div>}
        {isError && <EmptyState title="Erro ao carregar medições" description="Não foi possível carregar as medições desta obra." action={<button type="button" onClick={() => void refetch()} className="rounded-md bg-jogab-500 px-3 py-1.5 text-sm text-white">Tentar novamente</button>} />}
        {!isLoading && !isError && data && (<><section className="grid gap-4 xl:grid-cols-3">{data.resumoCards.map((card) => <ObraWorkspaceResumoCard key={card.id} card={card} />)}</section>{filtered.length === 0 ? <EmptyState title="Nenhuma medição encontrada" description="Não há medições desta obra para o filtro atual." /> : <ObraWorkspaceTable columns={['Competência', 'Etapa', 'Status', 'Percentual', 'Valor']} rows={filtered.map((item) => [formatCompetencia(item.competencia), item.etapa, STATUS_OPTIONS.find((option) => option.value === item.status)?.label ?? item.status, `${item.percentual}%`, formatCurrency(item.valor)])} />}</>)}
      </MainContent>
    </div>
  );
}
