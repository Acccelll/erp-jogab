import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FuncionariosListPage } from '@/modules/rh/pages/FuncionariosListPage';

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

vi.mock('../hooks/useFuncionarios', () => ({
  useFuncionarios: vi.fn(),
}));

vi.mock('../hooks/useFuncionarioFilters', () => ({
  useFuncionarioFilters: () => ({
    filters: {},
    setSearch: vi.fn(),
    setStatus: vi.fn(),
    setTipoContrato: vi.fn(),
    clearFilters: vi.fn(),
    hasActiveFilters: false,
  }),
}));

vi.mock('../components/FuncionarioMutationDrawerForm', () => ({
  FuncionarioMutationDrawerForm: () => <div data-testid="mutation-drawer" />,
}));

vi.mock('../components/FuncionarioStatusBadge', () => ({
  FuncionarioStatusBadge: ({ status }: { status: string }) => <span>{status}</span>,
}));

import { useFuncionarios } from '../hooks/useFuncionarios';

const mockUseFuncionarios = vi.mocked(useFuncionarios);

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
        <FuncionariosListPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('FuncionariosListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state with skeletons', () => {
    mockUseFuncionarios.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as ReturnType<typeof useFuncionarios>);

    const { container } = renderWithRouter();
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders error state', () => {
    mockUseFuncionarios.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { type: 'http', status: 500 } as any,
    } as ReturnType<typeof useFuncionarios>);

    renderWithRouter();
    expect(screen.getByText('Falha na requisição')).toBeInTheDocument();
  });

  it('renders data state with table and quick filter chips', () => {
    mockUseFuncionarios.mockReturnValue({
      data: {
        data: [
          {
            id: 'func-1',
            nome: 'João Silva',
            matricula: 'MAT001',
            cpf: '000.000.000-00',
            status: 'ativo' as const,
            tipoContrato: 'clt' as const,
            cargo: 'Eng',
            funcao: 'Eng',
            departamento: 'Obra',
            filialNome: 'F1',
            obraAlocadoNome: 'Obra A',
            dataAdmissao: '2025-01-01',
            salarioBase: 5000,
          },
        ],
        kpis: { totalFuncionarios: 1, ativos: 1, afastados: 0, ferias: 0, desligados: 0, custoFolhaEstimado: 5000 },
        total: 1,
      },
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useFuncionarios>);

    renderWithRouter();
    expect(screen.getByText('João Silva')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    mockUseFuncionarios.mockReturnValue({
      data: {
        data: [],
        kpis: { totalFuncionarios: 0, ativos: 0, afastados: 0, ferias: 0, desligados: 0, custoFolhaEstimado: 0 },
        total: 0,
      },
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useFuncionarios>);

    renderWithRouter();
    expect(screen.getByText('Nenhum funcionário encontrado')).toBeInTheDocument();
  });

  it('does not crash with partial/null data fields', () => {
    mockUseFuncionarios.mockReturnValue({
      data: {
        data: undefined,
        kpis: undefined,
        total: undefined,
      } as unknown as ReturnType<typeof useFuncionarios>['data'],
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useFuncionarios>);

    renderWithRouter();
    expect(screen.getByText('Nenhum funcionário encontrado')).toBeInTheDocument();
  });
});
