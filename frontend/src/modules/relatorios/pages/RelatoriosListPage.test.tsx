import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RelatoriosListPage } from '@/modules/relatorios/pages/RelatoriosListPage';
import type { RelatoriosDashboardData } from '@/modules/relatorios/types';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
const refetchMock = vi.fn();
const setSearchMock = vi.fn();
const setCategoriaMock = vi.fn();
const setDisponibilidadeMock = vi.fn();
const setFormatoMock = vi.fn();
const setCompetenciaMock = vi.fn();
const clearFiltersMock = vi.fn();

vi.mock('@/modules/relatorios/hooks', () => ({
  useRelatorios: vi.fn(),
  useRelatoriosFilters: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => <a href={to}>{children}</a>,
}));

vi.mock('@/shared/components', () => ({
  EmptyState: ({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) => (
    <div data-testid="empty-state">
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  ),
  MainContent: ({ children }: { children: React.ReactNode }) => <div data-testid="main-content">{children}</div>,
  PageHeader: ({ title }: { title: string }) => <div data-testid="page-header">{title}</div>,
}));

vi.mock('../components', () => ({
  RelatorioCategoriaCard: ({ item }: { item: { categoria: string } }) => (
    <div data-testid={`cat-card-${item.categoria}`}>{item.categoria}</div>
  ),
  RelatorioResumoCard: ({ card }: { card: { id: string; titulo: string } }) => (
    <div data-testid={`resumo-card-${card.id}`}>{card.titulo}</div>
  ),
  RelatorioSaidaCard: ({ item }: { item: { id: string; titulo: string } }) => (
    <div data-testid={`saida-card-${item.id}`}>{item.titulo}</div>
  ),
  RelatorioCoberturaCard: ({ item }: { item: { modulo: string } }) => (
    <div data-testid={`cobertura-card-${item.modulo}`}>{item.modulo}</div>
  ),
  RelatoriosFilters: () => <div data-testid="relatorios-filters" />,
  RelatoriosResumoBar: ({ resumo }: { resumo: { totalRelatorios: number } }) => (
    <div data-testid="resumo-bar">{resumo.totalRelatorios} relatórios</div>
  ),
  RelatoriosTable: ({ items }: { items: unknown[] }) => <div data-testid="relatorios-table">{items.length} itens</div>,
}));

import { useRelatorios, useRelatoriosFilters } from '@/modules/relatorios/hooks';

const mockUseRelatorios = vi.mocked(useRelatorios);
const mockUseRelatoriosFilters = vi.mocked(useRelatoriosFilters);

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------
const defaultFiltersReturn = {
  filters: {
    search: '',
    categoria: undefined,
    disponibilidade: undefined,
    formato: undefined,
    competencia: undefined,
    obraId: undefined,
  },
  setSearch: setSearchMock,
  setCategoria: setCategoriaMock,
  setDisponibilidade: setDisponibilidadeMock,
  setFormato: setFormatoMock,
  setCompetencia: setCompetenciaMock,
  clearFilters: clearFiltersMock,
  hasActiveFilters: false,
} as ReturnType<typeof useRelatoriosFilters>;

const mockDashboardData: RelatoriosDashboardData = {
  resumo: {
    totalRelatorios: 10,
    categoriasAtivas: 5,
    disponiveis: 7,
    planejados: 3,
    exportaveis: 6,
  },
  categorias: [
    {
      categoria: 'obras' as const,
      titulo: 'Obras',
      descricao: 'Desc',
      quantidade: 3,
      disponiveis: 2,
      formatos: ['pdf' as const],
      modulosRelacionados: ['obras'],
    },
  ],
  itens: [
    {
      id: 'r1',
      codigo: 'REL-001',
      nome: 'Relatório de Obras',
      categoria: 'obras' as const,
      disponibilidade: 'disponivel' as const,
      descricao: 'Relatório detalhado',
      origemDados: ['Obras'],
      output: {
        formatos: ['pdf' as const],
        agendavel: false,
        permiteComparativo: false,
        formatoPrincipal: 'pdf' as const,
        tempoEstimado: '5min',
        recorrenciaSugerida: 'mensal',
      },
      ultimaAtualizacaoEm: '2026-03-01',
    },
  ],
  resumoCards: [
    {
      id: 'rc1',
      titulo: 'Visão Geral',
      descricao: 'Consolidação geral',
      itens: [{ label: 'Total', valor: '10' }],
    },
  ],
  saidasOperacionais: [
    {
      id: 'so1',
      relatorioId: 'r1',
      titulo: 'Exportação PDF',
      descricao: 'Exportação padrão',
      formatoPrincipal: 'pdf' as const,
      formatosSecundarios: [],
      destinoPadrao: 'Download',
      tempoEstimado: '5min',
      agendamento: 'Manual',
      disponibilidade: 'disponivel' as const,
    },
  ],
  coberturaModulos: [
    { modulo: 'Obras', descricao: 'Módulo de obras', quantidadeRelatorios: 3, status: 'coberto' as const },
  ],
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('RelatoriosListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRelatoriosFilters.mockReturnValue(defaultFiltersReturn);
  });

  it('renders loading state', () => {
    mockUseRelatorios.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: refetchMock,
    } as ReturnType<typeof useRelatorios>);

    render(<RelatoriosListPage />);

    expect(screen.getByPlaceholderText(/buscar relatório/i)).toBeInTheDocument();
    expect(screen.getByText(/carregando catálogo/i)).toBeInTheDocument();
  });

  it('renders error state with retry', async () => {
    const user = userEvent.setup();
    mockUseRelatorios.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch: refetchMock,
    } as ReturnType<typeof useRelatorios>);

    render(<RelatoriosListPage />);

    expect(screen.getByText('Erro ao carregar relatórios')).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /tentar novamente/i });
    await user.click(retryBtn);
    expect(refetchMock).toHaveBeenCalled();
  });

  it('renders data state with items and categories', () => {
    mockUseRelatorios.mockReturnValue({
      data: mockDashboardData,
      isLoading: false,
      isError: false,
      refetch: refetchMock,
    } as ReturnType<typeof useRelatorios>);

    render(<RelatoriosListPage />);

    expect(screen.getByTestId('cat-card-obras')).toBeInTheDocument();
    expect(screen.getByTestId('relatorios-table')).toHaveTextContent('1 itens');
  });

  it('renders empty state when no items match filters', () => {
    mockUseRelatorios.mockReturnValue({
      data: { ...mockDashboardData, itens: [] },
      isLoading: false,
      isError: false,
      refetch: refetchMock,
    } as ReturnType<typeof useRelatorios>);
    mockUseRelatoriosFilters.mockReturnValue({
      ...defaultFiltersReturn,
      hasActiveFilters: true,
    });

    render(<RelatoriosListPage />);

    expect(screen.getByText('Nenhum relatório encontrado')).toBeInTheDocument();
    expect(screen.getByText(/nenhum relatório corresponde/i)).toBeInTheDocument();
  });
});
