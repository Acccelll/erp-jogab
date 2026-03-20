import { EmptyState, MainContent, PageHeader } from '@/shared/components';
import { useDocumentosFiscaisSaida, useFiscalFilters } from '../hooks';
import { DocumentosFiscaisTable, FiscalFilters } from '../components';

export function FiscalSaidasPage() {
  const {
    filters,
    setSearch,
    setStatus,
    setTipo,
    setFluxo,
    setCompetencia,
    clearFilters,
    hasActiveFilters,
  } = useFiscalFilters();

  const { data, isLoading, isError, refetch } = useDocumentosFiscaisSaida({ ...filters, fluxo: 'saida' });

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Documentos Fiscais de Saída"
        subtitle="Notas fiscais emitidas para clientes e faturamentos vinculados à execução das obras."
      />

      <FiscalFilters
        search={filters.search ?? ''}
        status={filters.status}
        tipo={filters.tipo}
        fluxo="saida"
        competencia={filters.competencia}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onTipoChange={setTipo}
        onFluxoChange={setFluxo}
        onCompetenciaChange={setCompetencia}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <MainContent className="space-y-4">
        {isLoading && <p className="text-sm text-gray-500">Carregando documentos de saída...</p>}

        {isError && (
          <EmptyState
            title="Erro ao carregar saídas fiscais"
            description="Não foi possível carregar os documentos fiscais de saída."
            action={
              <button type="button" onClick={() => void refetch()} className="rounded-md bg-jogab-500 px-3 py-1.5 text-sm text-white hover:bg-jogab-600">
                Tentar novamente
              </button>
            }
          />
        )}

        {!isLoading && !isError && data && data.length === 0 && (
          <EmptyState
            title="Nenhum documento de saída encontrado"
            description="Os faturamentos filtrados ainda não geraram documentos fiscais visíveis."
          />
        )}

        {!isLoading && !isError && data && data.length > 0 && <DocumentosFiscaisTable items={data} />}
      </MainContent>
    </div>
  );
}
