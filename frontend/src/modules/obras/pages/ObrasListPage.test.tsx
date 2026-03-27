import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ObrasListPage } from '@/modules/obras/pages/ObrasListPage';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('@/shared/stores', () => ({
  useDrawerStore: vi.fn(() => ({
    openDrawer: vi.fn(),
    closeDrawer: vi.fn(),
  })),
  usePreferencesStore: vi.fn((selector) =>
    selector({
      columns: {},
      savedFilters: {},
    })
  ),
  useNotificationStore: vi.fn(() => ({
    addNotification: vi.fn(),
  })),
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

vi.mock('../components/ObraMutationDrawerForm', () => ({
  ObraMutationDrawerForm: () => <div data-testid="mutation-drawer" />,
}));

vi.mock('../components/ObraStatusBadge', () => ({
  ObraStatusBadge: ({ status }: { status: string }) => <span>{status}</span>,
}));

import { useObras } from '../hooks/useObras';

const mockUseObras = vi.mocked(useObras);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderWithRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ObrasListPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('ObrasListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state with skeletons', () => {
    mockUseObras.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as ReturnType<typeof useObras>);

    const { container } = renderWithRouter();
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders error state', () => {
    mockUseObras.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { type: 'http', status: 500 } as any,
    } as ReturnType<typeof useObras>);

    renderWithRouter();
    expect(screen.getByText('Falha na requisição')).toBeInTheDocument();
  });

  it('renders data state with table and quick filter chips', () => {
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
    expect(screen.getByText('Obra Alfa')).toBeInTheDocument();
    expect(screen.getByText('Em andamento')).toBeInTheDocument();
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
