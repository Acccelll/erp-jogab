import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ObrasListPage } from '@/modules/obras/pages/ObrasListPage';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('@/shared/stores', () => ({
  useDrawerStore: () => vi.fn(),
}));

vi.mock('../hooks/useObras', () => ({
  useObras: vi.fn(),
}));

vi.mock('../hooks/useObraFilters', () => ({
  useObraFilters: () => ({
    filters: {},
    setSearch: vi.fn(),
    setStatus: vi.fn(),
    setTipo: vi.fn(),
    clearFilters: vi.fn(),
    hasActiveFilters: false,
  }),
}));

vi.mock('../components/ObraKpiBar', () => ({
  ObraKpiBar: ({ kpis }: { kpis: { totalObras: number } }) => <div data-testid="kpi-bar">{kpis.totalObras} obras</div>,
}));

vi.mock('../components/ObraFilters', () => ({
  ObraFilters: () => <div data-testid="filters" />,
}));

vi.mock('../components/ObraCard', () => ({
  ObraCard: ({ obra }: { obra: { id: string; nome: string } }) => (
    <div data-testid={`card-${obra.id}`}>{obra.nome}</div>
  ),
}));

vi.mock('../components/ObraMutationDrawerForm', () => ({
  ObraMutationDrawerForm: () => <div data-testid="mutation-drawer" />,
}));

import { useObras } from '../hooks/useObras';

const mockUseObras = vi.mocked(useObras);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderWithRouter() {
  return render(
    <MemoryRouter>
      <ObrasListPage />
    </MemoryRouter>,
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('ObrasListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    mockUseObras.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as ReturnType<typeof useObras>);

    renderWithRouter();
    expect(screen.getByText('Carregando obras...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    mockUseObras.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as ReturnType<typeof useObras>);

    renderWithRouter();
    expect(screen.getByText('Erro ao carregar obras')).toBeInTheDocument();
  });

  it('renders data state with KPIs and cards', () => {
    mockUseObras.mockReturnValue({
      data: {
        data: [
          {
            id: 'obra-1',
            codigo: 'OBR-001',
            nome: 'Obra Alfa',
            status: 'em_andamento' as const,
            tipo: 'residencial' as const,
            clienteNome: 'Cliente A',
            responsavelNome: 'Gestor A',
            filialNome: 'F1',
            cidade: 'SP',
            uf: 'SP',
            dataInicio: '2025-01-01',
            dataPrevisaoFim: '2026-12-31',
            percentualConcluido: 40,
            orcamentoPrevisto: 500000,
            custoRealizado: 200000,
            totalFuncionarios: 15,
          },
        ],
        kpis: {
          totalObras: 1,
          obrasAtivas: 1,
          obrasConcluidas: 0,
          obrasParalisadas: 0,
          orcamentoTotal: 500000,
          custoRealizadoTotal: 200000,
        },
        total: 1,
      },
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useObras>);

    renderWithRouter();
    expect(screen.getByTestId('kpi-bar')).toHaveTextContent('1 obras');
    expect(screen.getByTestId('card-obra-1')).toHaveTextContent('Obra Alfa');
  });

  it('renders empty state', () => {
    mockUseObras.mockReturnValue({
      data: {
        data: [],
        kpis: {
          totalObras: 0,
          obrasAtivas: 0,
          obrasConcluidas: 0,
          obrasParalisadas: 0,
          orcamentoTotal: 0,
          custoRealizadoTotal: 0,
        },
        total: 0,
      },
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useObras>);

    renderWithRouter();
    expect(screen.getByText('Nenhuma obra encontrada')).toBeInTheDocument();
  });

  it('does not crash with partial/null data fields', () => {
    mockUseObras.mockReturnValue({
      data: {
        data: undefined,
        kpis: undefined,
        total: undefined,
      } as unknown as ReturnType<typeof useObras>['data'],
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useObras>);

    renderWithRouter();
    expect(screen.getByText('Nenhuma obra encontrada')).toBeInTheDocument();
  });
});
