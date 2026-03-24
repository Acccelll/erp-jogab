import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { FiscalListPage } from '@/modules/fiscal/pages/FiscalListPage';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const refetchMock = vi.fn();

vi.mock('@/modules/fiscal/hooks', () => ({
  useFiscal: vi.fn(),
  useFiscalFilters: () => ({
    filters: {},
    setSearch: vi.fn(),
    setTipoOperacao: vi.fn(),
    setDocumentoTipo: vi.fn(),
    setStatus: vi.fn(),
    setEstoqueStatus: vi.fn(),
    setFinanceiroStatus: vi.fn(),
    setCompetencia: vi.fn(),
    clearFilters: vi.fn(),
    hasActiveFilters: false,
  }),
}));

vi.mock('../components', () => ({
  FiscalFilters: () => <div data-testid="fiscal-filters" />,
  FiscalKpiBar: ({ kpis }: { kpis: { totalDocumentos: number } }) => (
    <div data-testid="fiscal-kpi-bar">{kpis.totalDocumentos} documentos</div>
  ),
  FiscalResumoCard: ({ card }: { card: { id: string; titulo: string } }) => (
    <div data-testid={`resumo-card-${card.id}`}>{card.titulo}</div>
  ),
  FiscalTable: ({ items }: { items: unknown[] }) => <div data-testid="fiscal-table">{items.length} documentos</div>,
}));

import { useFiscal } from '@/modules/fiscal/hooks';

const mockUseFiscal = vi.mocked(useFiscal);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderWithRouter() {
  return render(
    <MemoryRouter>
      <FiscalListPage />
    </MemoryRouter>,
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('FiscalListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    mockUseFiscal.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useFiscal>);

    renderWithRouter();
    expect(screen.getByText('Carregando visão fiscal...')).toBeInTheDocument();
  });

  it('renders error state with retry button', async () => {
    const user = userEvent.setup();
    mockUseFiscal.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useFiscal>);

    renderWithRouter();
    expect(screen.getByText('Erro ao carregar fiscal')).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /tentar novamente/i });
    await user.click(retryBtn);
    expect(refetchMock).toHaveBeenCalled();
  });

  it('renders data state with KPIs and table', () => {
    mockUseFiscal.mockReturnValue({
      data: {
        documentos: [
          {
            id: 'doc-1',
            codigo: 'NF-001',
            tipoOperacao: 'entrada' as const,
            documentoTipo: 'nfe' as const,
            numero: '001',
            serie: '1',
            descricao: 'Teste',
            fornecedorNome: 'Forn',
            obraId: '1',
            obraNome: 'Obra 1',
            competencia: '2026-03',
            status: 'validada' as const,
            estoqueStatus: 'pendente' as const,
            financeiroStatus: 'pendente' as const,
            impostos: { icms: 0, ipi: 0, pis: 0, cofins: 0, issqn: 0, totalImpostos: 0 },
            valorTotal: 10000,
            dataEmissao: '2026-03-01',
            dataEntrada: '2026-03-02',
          },
        ],
        kpis: {
          totalDocumentos: 1,
          totalEntradas: 1,
          totalSaidas: 0,
          valorEntradas: 10000,
          valorSaidas: 0,
          validando: 0,
          comErro: 0,
        },
        resumoCards: [{ id: 'card-1', titulo: 'Resumo Fiscal', descricao: 'Desc', itens: [] }],
        statusResumo: [],
      },
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useFiscal>);

    renderWithRouter();
    expect(screen.getByText('Fiscal')).toBeInTheDocument();
    expect(screen.getByTestId('fiscal-kpi-bar')).toHaveTextContent('1 documentos');
    expect(screen.getByTestId('fiscal-table')).toHaveTextContent('1 documentos');
  });

  it('renders empty state when no documentos', () => {
    mockUseFiscal.mockReturnValue({
      data: {
        documentos: [],
        kpis: {
          totalDocumentos: 0,
          totalEntradas: 0,
          totalSaidas: 0,
          valorEntradas: 0,
          valorSaidas: 0,
          validando: 0,
          comErro: 0,
        },
        resumoCards: [],
        statusResumo: [],
      },
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useFiscal>);

    renderWithRouter();
    expect(screen.getByText('Nenhum documento fiscal encontrado')).toBeInTheDocument();
  });
});
