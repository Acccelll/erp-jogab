import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EmptyState, MainContent } from '@/shared/components';
import { formatCurrency } from '@/shared/lib/utils';
import { useObraContratos } from '../hooks';
import { ObraWorkspaceFilters, ObraWorkspaceResumoCard, ObraWorkspaceSectionHeader, ObraWorkspaceTable } from '../components';

const STATUS_OPTIONS = [
  { value: 'vigente', label: 'Vigente' },
  { value: 'em_aprovacao', label: 'Em aprovação' },
  { value: 'encerrado', label: 'Encerrado' },
];

export function ObraContratosPage() {
  const { obraId } = useParams<{ obraId: string }>();
  const { data, isLoading, isError, refetch } = useObraContratos(obraId);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | undefined>(undefined);

  const filtered = useMemo(() => (data?.items ?? []).filter((item) => {
    const matchesSearch = !search.trim() || `${item.codigo} ${item.objeto} ${item.contratado}`.toLowerCase().includes(search.trim().toLowerCase());
    const matchesStatus = !status || item.status === status;
    return matchesSearch && matchesStatus;
  }), [data?.items, search, status]);

  return (
    <div className="flex flex-1 flex-col">
      <MainContent className="space-y-6">
        <ObraWorkspaceSectionHeader title="Contratos da Obra" description="Contratos técnicos, aditivos e compromissos principais vinculados à execução da obra." actionLabel="Abrir Obras" actionHref="/obras" />
        <ObraWorkspaceFilters search={search} status={status} statusOptions={STATUS_OPTIONS} onSearchChange={setSearch} onStatusChange={setStatus} onClear={() => { setSearch(''); setStatus(undefined); }} hasActiveFilters={Boolean(search || status)} />
        {isLoading && <div className="py-12 text-center text-sm text-gray-500">Carregando contratos da obra...</div>}
        {isError && <EmptyState title="Erro ao carregar contratos" description="Não foi possível carregar os contratos vinculados à obra." action={<button type="button" onClick={() => void refetch()} className="rounded-md bg-jogab-500 px-3 py-1.5 text-sm text-white">Tentar novamente</button>} />}
        {!isLoading && !isError && data && (
          <>
            <section className="grid gap-4 xl:grid-cols-3">{data.resumoCards.map((card) => <ObraWorkspaceResumoCard key={card.id} card={card} />)}</section>
            {filtered.length === 0 ? <EmptyState title="Nenhum contrato encontrado" description="Não há contratos desta obra para o filtro atual." /> : <ObraWorkspaceTable columns={['Código', 'Objeto', 'Contratado', 'Status', 'Valor', 'Vencimento']} rows={filtered.map((item) => [item.codigo, item.objeto, item.contratado, STATUS_OPTIONS.find((option) => option.value === item.status)?.label ?? item.status, formatCurrency(item.valor), item.vencimento ?? '—'])} />}
          </>
        )}
      </MainContent>
    </div>
  );
}
