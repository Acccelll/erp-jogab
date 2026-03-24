import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FuncionariosListPage } from '@/modules/rh/pages/FuncionariosListPage';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('@/shared/stores', () => ({
  useDrawerStore: () => vi.fn(),
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

vi.mock('../components/FuncionarioKpiBar', () => ({
  FuncionarioKpiBar: ({ kpis }: { kpis: { totalFuncionarios: number } }) => (
    <div data-testid="kpi-bar">{kpis.totalFuncionarios} funcionários</div>
  ),
}));

vi.mock('../components/FuncionarioFilters', () => ({
  FuncionarioFilters: () => <div data-testid="filters" />,
}));

vi.mock('../components/FuncionarioCard', () => ({
  FuncionarioCard: ({ funcionario }: { funcionario: { id: string; nome: string } }) => (
    <div data-testid={`card-${funcionario.id}`}>{funcionario.nome}</div>
  ),
}));

vi.mock('../components/FuncionarioMutationDrawerForm', () => ({
  FuncionarioMutationDrawerForm: () => <div data-testid="mutation-drawer" />,
}));

import { useFuncionarios } from '../hooks/useFuncionarios';

const mockUseFuncionarios = vi.mocked(useFuncionarios);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderWithRouter() {
  return render(
    <MemoryRouter>
      <FuncionariosListPage />
    </MemoryRouter>,
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('FuncionariosListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    mockUseFuncionarios.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as ReturnType<typeof useFuncionarios>);

    renderWithRouter();
    expect(screen.getByText('Carregando funcionários...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    mockUseFuncionarios.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as ReturnType<typeof useFuncionarios>);

    renderWithRouter();
    expect(screen.getByText('Erro ao carregar funcionários')).toBeInTheDocument();
  });

  it('renders data state with KPIs and cards', () => {
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
    expect(screen.getByTestId('kpi-bar')).toHaveTextContent('1 funcionários');
    expect(screen.getByTestId('card-func-1')).toHaveTextContent('João Silva');
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
