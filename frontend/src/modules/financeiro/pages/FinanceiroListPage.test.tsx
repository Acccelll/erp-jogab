import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { FinanceiroListPage } from '@/modules/financeiro/pages/FinanceiroListPage';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const refetchMock = vi.fn();

vi.mock('@/modules/financeiro/hooks', () => ({
  useFinanceiro: vi.fn(),
  useFinanceiroFilters: () => ({
    filters: {},
    setSearch: vi.fn(),
    setStatus: vi.fn(),
    setTipo: vi.fn(),
    setOrigem: vi.fn(),
    setCompetencia: vi.fn(),
    clearFilters: vi.fn(),
    hasActiveFilters: false,
  }),
  useFinanceiroPessoal: () => ({ data: undefined }),
}));

vi.mock('../components', () => ({
  FinanceiroResumoCard: ({ card }: { card: { id: string; titulo: string } }) => (
    <div data-testid={`resumo-card-${card.id}`}>{card.titulo}</div>
  ),
  FinanceiroVisaoStatusTipo: () => <div data-testid="visao-status-tipo" />,
  TitulosFinanceirosTable: ({ items }: { items: unknown[] }) => (
    <div data-testid="titulos-table">{items.length} títulos</div>
  ),
}));

import { useFinanceiro } from '@/modules/financeiro/hooks';

const mockUseFinanceiro = vi.mocked(useFinanceiro);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderWithRouter() {
  return render(
    <MemoryRouter>
      <FinanceiroListPage />
    </MemoryRouter>,
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('FinanceiroListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    mockUseFinanceiro.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useFinanceiro>);

    const { container } = renderWithRouter();
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders error state with retry button', async () => {
    const user = userEvent.setup();
    mockUseFinanceiro.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useFinanceiro>);

    renderWithRouter();
    expect(screen.getByText('Erro ao carregar Financeiro')).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /tentar novamente/i });
    await user.click(retryBtn);
    expect(refetchMock).toHaveBeenCalled();
  });

  it('renders data state with KPIs and table', () => {
    mockUseFinanceiro.mockReturnValue({
      data: {
        titulos: [
          {
            id: 'tit-1',
            codigo: 'TIT-001',
            tipo: 'pagar' as const,
            descricao: 'Teste',
            fornecedorNome: 'Forn',
            obraId: '1',
            obraNome: 'Obra 1',
            centroCustoNome: 'CC1',
            competencia: '2026-03',
            status: 'previsto' as const,
            origem: 'compras' as const,
            valor: 5000,
            dataEmissao: '2026-03-01',
            dataVencimento: '2026-03-15',
            integracaoFiscal: false,
            integracaoCompras: false,
          },
        ],
        kpis: {
          totalTitulos: 1,
          totalPagar: 1,
          totalReceber: 0,
          valorPagar: 5000,
          valorReceber: 0,
          valorVencido: 0,
          saldoProjetado: -5000,
        },
        resumoCards: [{ id: 'card-1', titulo: 'Resumo', descricao: 'Desc', itens: [] }],
        statusResumo: [],
        tipoResumo: [],
        pessoal: {
          competencia: {
            competencia: '2026-03',
            totalFuncionarios: 0,
            totalObras: 0,
            totalCentrosCusto: 0,
            valorHorasExtrasPrevisto: 0,
            valorHorasExtrasRealizado: 0,
            valorFopagPrevisto: 0,
            valorFopagRealizado: 0,
            valorPrevisto: 0,
            valorRealizado: 0,
            variacao: 0,
            statusFechamento: 'aberta' as const,
          },
          porObra: [],
          porCentroCusto: [],
          previstoRealizado: [],
          destaques: [],
        },
      },
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useFinanceiro>);

    renderWithRouter();
    expect(screen.getByText('Títulos financeiros')).toBeInTheDocument();
    expect(screen.getByTestId('titulos-table')).toHaveTextContent('1 títulos');
  });

  it('renders empty state when no titulos', () => {
    mockUseFinanceiro.mockReturnValue({
      data: {
        titulos: [],
        kpis: {
          totalTitulos: 0,
          totalPagar: 0,
          totalReceber: 0,
          valorPagar: 0,
          valorReceber: 0,
          valorVencido: 0,
          saldoProjetado: 0,
        },
        resumoCards: [],
        statusResumo: [],
        tipoResumo: [],
        pessoal: {
          competencia: {
            competencia: '2026-03',
            totalFuncionarios: 0,
            totalObras: 0,
            totalCentrosCusto: 0,
            valorHorasExtrasPrevisto: 0,
            valorHorasExtrasRealizado: 0,
            valorFopagPrevisto: 0,
            valorFopagRealizado: 0,
            valorPrevisto: 0,
            valorRealizado: 0,
            variacao: 0,
            statusFechamento: 'aberta' as const,
          },
          porObra: [],
          porCentroCusto: [],
          previstoRealizado: [],
          destaques: [],
        },
      },
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useFinanceiro>);

    renderWithRouter();
    expect(screen.getByText('Nenhum título encontrado')).toBeInTheDocument();
  });
});
