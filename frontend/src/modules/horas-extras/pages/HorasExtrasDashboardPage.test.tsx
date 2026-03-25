import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { HorasExtrasDashboardPage } from '@/modules/horas-extras/pages/HorasExtrasDashboardPage';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const refetchMock = vi.fn();

vi.mock('@/modules/horas-extras/hooks', () => ({
  useHorasExtras: vi.fn(),
  useHorasExtrasFilters: () => ({
    filters: {},
    setSearch: vi.fn(),
    setStatus: vi.fn(),
    setTipo: vi.fn(),
    setCompetencia: vi.fn(),
    clearFilters: vi.fn(),
    hasActiveFilters: false,
  }),
}));

vi.mock('../components', () => ({
  HorasExtrasTable: ({ items }: { items: unknown[] }) => <div data-testid="he-table">{items.length} items</div>,
}));

import { useHorasExtras } from '@/modules/horas-extras/hooks';

const mockUseHorasExtras = vi.mocked(useHorasExtras);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderWithRouter() {
  return render(
    <MemoryRouter>
      <HorasExtrasDashboardPage />
    </MemoryRouter>,
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('HorasExtrasDashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    mockUseHorasExtras.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useHorasExtras>);

    const { container } = renderWithRouter();
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders error state with retry button', async () => {
    const user = userEvent.setup();
    mockUseHorasExtras.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useHorasExtras>);

    renderWithRouter();
    expect(screen.getByText('Erro ao carregar lançamentos de horas extras')).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /tentar novamente/i });
    await user.click(retryBtn);
    expect(refetchMock).toHaveBeenCalled();
  });

  it('renders data state with table and approval link', () => {
    mockUseHorasExtras.mockReturnValue({
      data: {
        data: [
          {
            id: 'he-1',
            funcionarioNome: 'Lucas',
            matricula: '001',
            obraNome: 'Obra 1',
            competencia: '2026-03',
            dataLancamento: '2026-03-18',
            quantidadeHoras: 2,
            valorCalculado: 200,
            tipo: 'he_50' as const,
            status: 'pendente_aprovacao' as const,
            origem: 'obra' as const,
          },
        ],
        kpis: {
          totalLancamentos: 1,
          pendentesAprovacao: 1,
          aprovadas: 0,
          fechadasParaFopag: 0,
          horasTotais: 2,
          valorTotal: 200,
        },
        resumoCards: [{ id: 'card-1', titulo: 'Resumo', descricao: 'Desc', itens: [] }],
        fechamentoAtual: null,
      },
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useHorasExtras>);

    renderWithRouter();
    expect(screen.getByRole('heading', { name: 'Lançamentos' })).toBeInTheDocument();
    expect(screen.getByTestId('he-table')).toHaveTextContent('1 items');
    expect(screen.getByRole('link', { name: /abrir aprovação/i })).toHaveAttribute('href', '/horas-extras/aprovacao');
  });

  it('renders without crashing when data has empty arrays', () => {
    mockUseHorasExtras.mockReturnValue({
      data: {
        data: [],
        kpis: {
          totalLancamentos: 0,
          pendentesAprovacao: 0,
          aprovadas: 0,
          fechadasParaFopag: 0,
          horasTotais: 0,
          valorTotal: 0,
        },
        resumoCards: [],
        fechamentoAtual: null,
      },
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useHorasExtras>);

    renderWithRouter();
    expect(screen.getByText('Nenhum lançamento encontrado')).toBeInTheDocument();
  });
});
