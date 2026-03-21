import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EmptyState, MainContent } from '@/shared/components';
import { useObraDocumentos } from '../hooks';
import {
  ObraWorkspaceFilters,
  ObraWorkspaceResumoCard,
  ObraWorkspaceSectionHeader,
  ObraWorkspaceTable,
} from '../components';

const STATUS_OPTIONS = [
  { value: 'vigente', label: 'Vigente' },
  { value: 'a_vencer', label: 'A vencer' },
  { value: 'vencido', label: 'Vencido' },
  { value: 'em_analise', label: 'Em análise' },
];

export function ObraDocumentosPage() {
  const { obraId } = useParams<{ obraId: string }>();
  const { data, isLoading, isError, refetch } = useObraDocumentos(obraId);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | undefined>(undefined);

  const filtered = useMemo(() => {
    const items = data?.items ?? [];
    return items.filter((item) => {
      const matchesSearch = !search.trim() || `${item.codigo} ${item.titulo} ${item.tipo} ${item.responsavel}`.toLowerCase().includes(search.trim().toLowerCase());
      const matchesStatus = !status || item.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [data?.items, search, status]);

  return (
    <div className="flex flex-1 flex-col">
      <MainContent className="space-y-6">
        <ObraWorkspaceSectionHeader
          title="Documentos da Obra"
          description="Documentos críticos da obra para conformidade, segurança e liberação operacional."
          actionLabel="Abrir Documentos"
          actionHref="/documentos"
        />

        <ObraWorkspaceFilters
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

        {isLoading && <div className="py-12 text-center text-sm text-gray-500">Carregando documentos da obra...</div>}
        {isError && <EmptyState title="Erro ao carregar documentos" description="Não foi possível carregar os documentos desta obra." action={<button type="button" onClick={() => void refetch()} className="rounded-md bg-jogab-500 px-3 py-1.5 text-sm text-white">Tentar novamente</button>} />}

        {!isLoading && !isError && data && (
          <>
            <section className="grid gap-4 xl:grid-cols-3">
              {data.resumoCards.map((card) => <ObraWorkspaceResumoCard key={card.id} card={card} />)}
            </section>
            {filtered.length === 0 ? (
              <EmptyState title="Nenhum documento encontrado" description="Não há documentos desta obra para o filtro atual." />
            ) : (
              <ObraWorkspaceTable
                columns={['Código', 'Título', 'Tipo', 'Status', 'Responsável', 'Vencimento']}
                rows={filtered.map((item) => [
                  item.codigo,
                  item.titulo,
                  item.tipo,
                  STATUS_OPTIONS.find((option) => option.value === item.status)?.label ?? item.status,
                  item.responsavel,
                  item.vencimento ?? '—',
                ])}
              />
            )}
          </>
        )}
      </MainContent>
    </div>
  );
}
