import { EmptyState, MainContent, PageHeader } from '@/shared/components';
import { useDocumentosFiscaisEntrada, useFiscalFilters } from '../hooks';
import { DocumentosFiscaisTable, FiscalFilters } from '../components';

export function FiscalEntradasPage() {
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

  const { data, isLoading, isError, refetch } = useDocumentosFiscaisEntrada({ ...filters, fluxo: 'entrada' });

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Documentos Fiscais de Entrada"
        subtitle="Notas e conhecimentos recebidos a partir de Compras, recebimentos e apropriação por obra."
      />

      <FiscalFilters
        search={filters.search ?? ''}
        status={filters.status}
        tipo={filters.tipo}
        fluxo="entrada"
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
        {isLoading && <p className="text-sm text-gray-500">Carregando documentos de entrada...</p>}

        {isError && (
          <EmptyState
            title="Erro ao carregar entradas fiscais"
            description="Não foi possível carregar os documentos fiscais de entrada."
            action={
              <button type="button" onClick={() => void refetch()} className="rounded-md bg-jogab-500 px-3 py-1.5 text-sm text-white hover:bg-jogab-600">
                Tentar novamente
              </button>
            }
          />
        )}

        {!isLoading && !isError && data && data.length === 0 && (
          <EmptyState
            title="Nenhum documento de entrada encontrado"
            description="As compras e recebimentos filtrados ainda não geraram documentos fiscais visíveis."
          />
        )}

        {!isLoading && !isError && data && data.length > 0 && <DocumentosFiscaisTable items={data} />}
      </MainContent>
    </div>
  );
}
