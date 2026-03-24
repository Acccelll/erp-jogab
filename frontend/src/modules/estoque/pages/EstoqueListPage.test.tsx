import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { EstoqueListPage } from '@/modules/estoque/pages/EstoqueListPage';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const refetchMock = vi.fn();

vi.mock('@/modules/estoque/hooks', () => ({
  useEstoque: vi.fn(),
  useEstoqueFilters: () => ({
    filters: {},
    setSearch: vi.fn(),
    setStatus: vi.fn(),
    setTipo: vi.fn(),
    setLocalId: vi.fn(),
    setCompetencia: vi.fn(),
    setMovimentacaoTipo: vi.fn(),
    clearFilters: vi.fn(),
    hasActiveFilters: false,
  }),
}));

vi.mock('../components', () => ({
  EstoqueFilters: () => <div data-testid="estoque-filters" />,
  EstoqueKpiBar: ({ kpis }: { kpis: { totalItens: number } }) => (
    <div data-testid="estoque-kpi-bar">{kpis.totalItens} itens</div>
  ),
  EstoqueResumoCard: ({ card }: { card: { id: string; titulo: string } }) => (
    <div data-testid={`resumo-card-${card.id}`}>{card.titulo}</div>
  ),
  EstoqueVisaoGeral: () => <div data-testid="estoque-visao-geral" />,
  EstoqueItensTable: ({ items }: { items: unknown[] }) => (
    <div data-testid="estoque-itens-table">{items.length} itens</div>
  ),
}));

import { useEstoque } from '@/modules/estoque/hooks';

const mockUseEstoque = vi.mocked(useEstoque);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderWithRouter() {
  return render(
    <MemoryRouter>
      <EstoqueListPage />
    </MemoryRouter>,
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('EstoqueListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    mockUseEstoque.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useEstoque>);

    renderWithRouter();
    expect(screen.getByText('Carregando visão de estoque...')).toBeInTheDocument();
  });

  it('renders error state with retry button', async () => {
    const user = userEvent.setup();
    mockUseEstoque.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useEstoque>);

    renderWithRouter();
    expect(screen.getByText('Erro ao carregar estoque')).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /tentar novamente/i });
    await user.click(retryBtn);
    expect(refetchMock).toHaveBeenCalled();
  });

  it('renders data state with KPIs and table', () => {
    mockUseEstoque.mockReturnValue({
      data: {
        itens: [
          {
            id: 'item-1',
            codigo: 'MAT-001',
            nome: 'Cimento',
            descricao: 'Cimento Portland',
            tipo: 'material' as const,
            unidade: 'kg',
            categoria: 'Material',
            obraId: '1',
            obraNome: 'Obra 1',
            localId: 'loc-1',
            localNome: 'Almox 1',
            status: 'disponivel' as const,
            saldos: { quantidade: 100, reservado: 10, disponivel: 90, valorUnitario: 25, valorTotal: 2500 },
            consumoMensal: 50,
            previsaoReposicao: '2026-04-01',
            origemUltimaEntrada: 'compras' as const,
            ultimaMovimentacao: '2026-03-10',
          },
        ],
        movimentacoes: [],
        kpis: {
          totalItens: 1,
          itensCriticos: 0,
          locaisAtivos: 1,
          valorEstocado: 2500,
          valorReservado: 250,
          consumoMensal: 50,
          entradasPendentes: 0,
        },
        resumoCards: [{ id: 'card-1', titulo: 'Resumo Estoque', descricao: 'Desc', itens: [] }],
        statusResumo: [],
        localResumo: [],
        tipoResumo: [],
      },
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useEstoque>);

    renderWithRouter();
    expect(screen.getByText('Estoque')).toBeInTheDocument();
    expect(screen.getByTestId('estoque-kpi-bar')).toHaveTextContent('1 itens');
    expect(screen.getByTestId('estoque-itens-table')).toHaveTextContent('1 itens');
  });

  it('renders empty state when no itens', () => {
    mockUseEstoque.mockReturnValue({
      data: {
        itens: [],
        movimentacoes: [],
        kpis: {
          totalItens: 0,
          itensCriticos: 0,
          locaisAtivos: 0,
          valorEstocado: 0,
          valorReservado: 0,
          consumoMensal: 0,
          entradasPendentes: 0,
        },
        resumoCards: [],
        statusResumo: [],
        localResumo: [],
        tipoResumo: [],
      },
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useEstoque>);

    renderWithRouter();
    expect(screen.getByText('Nenhum item encontrado')).toBeInTheDocument();
  });
});
