import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { FopagListPage } from '@/modules/fopag/pages/FopagListPage';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const refetchMock = vi.fn();

vi.mock('../hooks', () => ({
  useFopagCompetencias: vi.fn(),
  useFopagFilters: () => ({
    filters: {},
    setSearch: vi.fn(),
    setStatus: vi.fn(),
    setCompetencia: vi.fn(),
    clearFilters: vi.fn(),
    hasActiveFilters: false,
  }),
}));

vi.mock('../components', () => ({
  FopagFilters: () => <div data-testid="fopag-filters" />,
  FopagKpiBar: ({ kpis }: { kpis: { totalCompetencias: number } }) => (
    <div data-testid="fopag-kpi-bar">{kpis.totalCompetencias} competências</div>
  ),
  FopagCompetenciaCard: ({ competencia }: { competencia: { id: string; competencia: string } }) => (
    <div data-testid={`comp-card-${competencia.id}`}>{competencia.competencia}</div>
  ),
}));

import { useFopagCompetencias } from '../hooks';

const mockUseFopagCompetencias = vi.mocked(useFopagCompetencias);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderWithRouter() {
  return render(
    <MemoryRouter>
      <FopagListPage />
    </MemoryRouter>,
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('FopagListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    mockUseFopagCompetencias.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useFopagCompetencias>);

    renderWithRouter();
    expect(screen.getByText('Carregando competências...')).toBeInTheDocument();
  });

  it('renders error state with retry button', async () => {
    const user = userEvent.setup();
    mockUseFopagCompetencias.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useFopagCompetencias>);

    renderWithRouter();
    expect(screen.getByText('Erro ao carregar competências da FOPAG')).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /tentar novamente/i });
    await user.click(retryBtn);
    expect(refetchMock).toHaveBeenCalled();
  });

  it('renders data state with KPIs and cards', () => {
    mockUseFopagCompetencias.mockReturnValue({
      data: {
        data: [
          {
            id: 'fopag-1',
            competencia: '2026-03',
            status: 'aberta' as const,
            totalFuncionarios: 10,
            totalObras: 3,
            totalEventos: 5,
            valorPrevisto: 100000,
            valorRealizado: 80000,
            valorHorasExtras: 10000,
            updatedAt: '2026-03-15',
          },
        ],
        kpis: {
          totalCompetencias: 1,
          emConsolidacao: 0,
          prontasParaRateio: 0,
          valorPrevistoTotal: 100000,
          valorRealizadoTotal: 80000,
        },
      },
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useFopagCompetencias>);

    renderWithRouter();
    expect(screen.getByTestId('fopag-kpi-bar')).toHaveTextContent('1 competências');
    expect(screen.getByTestId('comp-card-fopag-1')).toHaveTextContent('2026-03');
  });

  it('renders empty state', () => {
    mockUseFopagCompetencias.mockReturnValue({
      data: {
        data: [],
        kpis: {
          totalCompetencias: 0,
          emConsolidacao: 0,
          prontasParaRateio: 0,
          valorPrevistoTotal: 0,
          valorRealizadoTotal: 0,
        },
      },
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useFopagCompetencias>);

    renderWithRouter();
    expect(screen.getByText('Nenhuma competência encontrada')).toBeInTheDocument();
  });

  it('does not crash with partial/null data fields', () => {
    mockUseFopagCompetencias.mockReturnValue({
      data: {
        data: undefined,
        kpis: undefined,
      } as unknown as ReturnType<typeof useFopagCompetencias>['data'],
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useFopagCompetencias>);

    renderWithRouter();
    expect(screen.getByText('Nenhuma competência encontrada')).toBeInTheDocument();
  });
});
