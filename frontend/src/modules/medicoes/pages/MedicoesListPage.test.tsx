import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { MedicoesListPage } from '@/modules/medicoes/pages/MedicoesListPage';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const refetchMock = vi.fn();

vi.mock('@/modules/medicoes/hooks', () => ({
  useMedicoes: vi.fn(),
  useMedicoesFilters: () => ({
    filters: {},
    setSearch: vi.fn(),
    setStatus: vi.fn(),
    setAprovacaoStatus: vi.fn(),
    setFaturamentoStatus: vi.fn(),
    setCompetencia: vi.fn(),
    clearFilters: vi.fn(),
    hasActiveFilters: false,
  }),
}));

vi.mock('../components', () => ({
  MedicoesFilters: () => <div data-testid="medicoes-filters" />,
  MedicoesKpiBar: ({ kpis }: { kpis: { totalMedicoes: number } }) => (
    <div data-testid="medicoes-kpi-bar">{kpis.totalMedicoes} medições</div>
  ),
  MedicoesResumoCard: ({ card }: { card: { id: string; titulo: string } }) => (
    <div data-testid={`resumo-card-${card.id}`}>{card.titulo}</div>
  ),
  MedicoesOverview: () => <div data-testid="medicoes-overview" />,
  MedicoesTable: ({ items }: { items: unknown[] }) => <div data-testid="medicoes-table">{items.length} medições</div>,
}));

import { useMedicoes } from '@/modules/medicoes/hooks';

const mockUseMedicoes = vi.mocked(useMedicoes);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderWithRouter() {
  return render(
    <MemoryRouter>
      <MedicoesListPage />
    </MemoryRouter>,
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('MedicoesListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    mockUseMedicoes.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useMedicoes>);

    const { container } = renderWithRouter();
    // TableSkeleton uses animate-pulse
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders error state with retry button', async () => {
    const user = userEvent.setup();
    mockUseMedicoes.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useMedicoes>);

    renderWithRouter();
    expect(screen.getByText('Algo deu errado')).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /tentar novamente/i });
    await user.click(retryBtn);
    expect(refetchMock).toHaveBeenCalled();
  });

  it('renders data state with KPIs and table', () => {
    mockUseMedicoes.mockReturnValue({
      data: {
        medicoes: [
          {
            id: 'med-1',
            codigo: 'MED-001',
            obraId: '1',
            obraNome: 'Obra 1',
            contratoId: 'ctr-1',
            contratoNome: 'Contrato 1',
            competencia: '2026-03',
            status: 'em_aprovacao' as const,
            aprovacaoStatus: 'pendente' as const,
            faturamentoStatus: 'pendente' as const,
            resumoFinanceiro: {
              valorMedido: 50000,
              valorAprovado: 0,
              valorFaturado: 0,
              valorReceber: 50000,
              percentualExecutado: 25,
              percentualFaturado: 0,
            },
            responsavel: 'João',
            createdAt: '2026-03-01',
            dataReferencia: '2026-03-01',
          },
        ],
        kpis: {
          totalMedicoes: 1,
          medicoesEmAprovacao: 1,
          medicoesAprovadas: 0,
          valorMedido: 50000,
          valorFaturado: 0,
          valorReceber: 50000,
        },
        resumoCards: [{ id: 'card-1', titulo: 'Resumo Medições', descricao: 'Desc', itens: [] }],
        statusResumo: [],
        competenciaResumo: [],
      },
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useMedicoes>);

    renderWithRouter();
    expect(screen.getByText('Medições e Faturamento')).toBeInTheDocument();
    expect(screen.getByTestId('medicoes-kpi-bar')).toHaveTextContent('1 medições');
    expect(screen.getByTestId('medicoes-table')).toHaveTextContent('1 medições');
  });

  it('renders empty state when no medicoes', () => {
    mockUseMedicoes.mockReturnValue({
      data: {
        medicoes: [],
        kpis: {
          totalMedicoes: 0,
          medicoesEmAprovacao: 0,
          medicoesAprovadas: 0,
          valorMedido: 0,
          valorFaturado: 0,
          valorReceber: 0,
        },
        resumoCards: [],
        statusResumo: [],
        competenciaResumo: [],
      },
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useMedicoes>);

    renderWithRouter();
    expect(screen.getByText('Nenhuma medição encontrada')).toBeInTheDocument();
  });
});
