import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { DocumentosListPage } from '@/modules/documentos/pages/DocumentosListPage';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const refetchMock = vi.fn();

vi.mock('@/modules/documentos/hooks', () => ({
  useDocumentos: vi.fn(),
  useDocumentosFilters: () => ({
    filters: {},
    setSearch: vi.fn(),
    setStatus: vi.fn(),
    setTipo: vi.fn(),
    setEntidade: vi.fn(),
    setAlerta: vi.fn(),
    setCompetencia: vi.fn(),
    clearFilters: vi.fn(),
    hasActiveFilters: false,
  }),
}));

vi.mock('../components', () => ({
  DocumentosFilters: () => <div data-testid="documentos-filters" />,
  DocumentosKpiBar: ({ kpis }: { kpis: { totalDocumentos: number } }) => (
    <div data-testid="documentos-kpi-bar">{kpis.totalDocumentos} documentos</div>
  ),
  DocumentosResumoCard: ({ card }: { card: { id: string; titulo: string } }) => (
    <div data-testid={`resumo-card-${card.id}`}>{card.titulo}</div>
  ),
  DocumentosOverview: () => <div data-testid="documentos-overview" />,
  DocumentosTable: ({ items }: { items: unknown[] }) => (
    <div data-testid="documentos-table">{items.length} documentos</div>
  ),
}));

import { useDocumentos } from '@/modules/documentos/hooks';

const mockUseDocumentos = vi.mocked(useDocumentos);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderWithRouter() {
  return render(
    <MemoryRouter>
      <DocumentosListPage />
    </MemoryRouter>,
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('DocumentosListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    mockUseDocumentos.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useDocumentos>);

    renderWithRouter();
    expect(screen.getByText('Carregando visão documental...')).toBeInTheDocument();
  });

  it('renders error state with retry button', async () => {
    const user = userEvent.setup();
    mockUseDocumentos.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useDocumentos>);

    renderWithRouter();
    expect(screen.getByText('Erro ao carregar documentos')).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /tentar novamente/i });
    await user.click(retryBtn);
    expect(refetchMock).toHaveBeenCalled();
  });

  it('renders data state with KPIs and table', () => {
    mockUseDocumentos.mockReturnValue({
      data: {
        documentos: [
          {
            id: 'doc-1',
            codigo: 'DOC-001',
            titulo: 'Contrato A',
            descricao: 'Contrato principal',
            tipo: 'contrato' as const,
            entidade: 'obra' as const,
            entidadeId: '1',
            entidadeNome: 'Obra 1',
            status: 'vigente' as const,
            alerta: 'nenhum' as const,
            vencimento: { dataVencimento: '2026-12-31', diasParaVencer: 282, alertaNivel: 'nenhum' as const },
            responsavel: 'Maria',
            createdAt: '2026-01-01',
            updatedAt: '2026-03-01',
          },
        ],
        kpis: { totalDocumentos: 1, vigentes: 1, aVencer: 0, vencidos: 0, entidadesCobertas: 1, alertasCriticos: 0 },
        resumoCards: [{ id: 'card-1', titulo: 'Resumo Docs', descricao: 'Desc', itens: [] }],
        statusResumo: [],
        vencimentoResumo: [],
      },
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useDocumentos>);

    renderWithRouter();
    expect(screen.getByText('Documentos')).toBeInTheDocument();
    expect(screen.getByTestId('documentos-kpi-bar')).toHaveTextContent('1 documentos');
    expect(screen.getByTestId('documentos-table')).toHaveTextContent('1 documentos');
  });

  it('renders empty state when no documentos', () => {
    mockUseDocumentos.mockReturnValue({
      data: {
        documentos: [],
        kpis: { totalDocumentos: 0, vigentes: 0, aVencer: 0, vencidos: 0, entidadesCobertas: 0, alertasCriticos: 0 },
        resumoCards: [],
        statusResumo: [],
        vencimentoResumo: [],
      },
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useDocumentos>);

    renderWithRouter();
    expect(screen.getByText('Nenhum documento encontrado')).toBeInTheDocument();
  });
});
