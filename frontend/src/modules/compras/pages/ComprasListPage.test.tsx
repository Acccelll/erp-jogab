import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ComprasListPage } from '@/modules/compras/pages/ComprasListPage';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const refetchMock = vi.fn();

vi.mock('@/modules/compras/hooks', () => ({
  useCompras: vi.fn(),
  useCompraFilters: () => ({
    filters: {},
    setSearch: vi.fn(),
    setStatus: vi.fn(),
    setCategoria: vi.fn(),
    setPrioridade: vi.fn(),
    setCompetencia: vi.fn(),
    clearFilters: vi.fn(),
    hasActiveFilters: false,
  }),
}));

vi.mock('../components', () => ({
  ComprasResumoCard: ({ card }: { card: { id: string; titulo: string } }) => (
    <div data-testid={`resumo-card-${card.id}`}>{card.titulo}</div>
  ),
  ComprasStatusOverview: ({ items }: { items: unknown[] }) => (
    <div data-testid="status-overview">{items.length} status</div>
  ),
  SolicitacoesCompraTable: ({ items }: { items: unknown[] }) => (
    <div data-testid="solicitacoes-table">{items.length} solicitações</div>
  ),
  PedidosCompraTable: ({ items }: { items: unknown[] }) => (
    <div data-testid="pedidos-table">{items.length} pedidos</div>
  ),
}));

import { useCompras } from '@/modules/compras/hooks';

const mockUseCompras = vi.mocked(useCompras);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderWithRouter() {
  return render(
    <MemoryRouter>
      <ComprasListPage />
    </MemoryRouter>,
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('ComprasListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    mockUseCompras.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useCompras>);

    const { container } = renderWithRouter();
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders error state with retry button', async () => {
    const user = userEvent.setup();
    mockUseCompras.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useCompras>);

    renderWithRouter();
    expect(screen.getByText('Erro ao carregar compras')).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /tentar novamente/i });
    await user.click(retryBtn);
    expect(refetchMock).toHaveBeenCalled();
  });

  it('renders data state with KPIs and tables', () => {
    mockUseCompras.mockReturnValue({
      data: {
        solicitacoes: [
          {
            id: 'sol-1',
            codigo: 'SOL-001',
            titulo: 'Material',
            descricao: '',
            solicitanteNome: 'Ana',
            obraId: '1',
            obraNome: 'Obra 1',
            centroCustoNome: 'CC1',
            competencia: '2026-03',
            categoria: 'material_obra' as const,
            prioridade: 'media' as const,
            status: 'pendente_aprovacao' as const,
            valorEstimado: 5000,
            itens: 2,
            createdAt: '2026-03-01',
            prazoNecessidade: '2026-03-15',
            integracaoFiscal: false,
            integracaoFinanceiro: false,
          },
        ],
        cotacoes: [],
        pedidos: [
          {
            id: 'ped-1',
            codigo: 'PED-001',
            solicitacaoId: 'sol-1',
            cotacaoId: null,
            fornecedorId: 'f1',
            fornecedorNome: 'Fornecedor A',
            obraId: '1',
            obraNome: 'Obra 1',
            centroCustoNome: 'CC1',
            competencia: '2026-03',
            categoria: 'material_obra' as const,
            prioridade: 'media' as const,
            status: 'pedido_emitido' as const,
            valorPedido: 4500,
            valorComprometidoFinanceiro: 4500,
            previsaoEntrega: '2026-03-20',
            fiscalStatus: 'pendente',
            financeiroStatus: 'pendente',
            itens: 2,
            createdAt: '2026-03-05',
          },
        ],
        kpis: {
          totalSolicitacoes: 1,
          solicitacoesPendentes: 1,
          cotacoesEmAberto: 0,
          pedidosEmitidos: 1,
          valorComprometido: 4500,
          valorAguardandoFiscal: 4500,
        },
        resumoCards: [{ id: 'card-1', titulo: 'Resumo Compras', descricao: 'Desc', itens: [] }],
        statusResumo: [],
      },
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useCompras>);

    renderWithRouter();
    expect(screen.getByTestId('solicitacoes-table')).toHaveTextContent('1 solicitações');
    expect(screen.getByTestId('pedidos-table')).toHaveTextContent('1 pedidos');
  });

  it('renders empty state when no solicitacoes or pedidos', () => {
    mockUseCompras.mockReturnValue({
      data: {
        solicitacoes: [],
        cotacoes: [],
        pedidos: [],
        kpis: {
          totalSolicitacoes: 0,
          solicitacoesPendentes: 0,
          cotacoesEmAberto: 0,
          pedidosEmitidos: 0,
          valorComprometido: 0,
          valorAguardandoFiscal: 0,
        },
        resumoCards: [],
        statusResumo: [],
      },
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useCompras>);

    renderWithRouter();
    expect(screen.getByText('Nenhuma compra encontrada')).toBeInTheDocument();
  });
});
