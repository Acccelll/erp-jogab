import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DashboardPage } from '@/modules/dashboard/pages/DashboardPage';
import type { DashboardSummary } from '@/modules/dashboard/types';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const refetchMock = vi.fn();

vi.mock('@/modules/dashboard/hooks', () => ({
  useDashboardSummary: vi.fn(),
}));

vi.mock('@/shared/stores', () => ({
  useContextStore: () => ({ competencia: '2026-03', obraId: null }),
}));

// Mock child components that aren't relevant to these tests
vi.mock('../components', () => ({
  DashboardAlertsPanel: ({ alerts }: { alerts: unknown[] }) => (
    <div data-testid="alerts-panel">{alerts.length} alertas</div>
  ),
  DashboardSectionCard: ({ section }: { section: { id: string; title: string } }) => (
    <div data-testid={`section-card-${section.id}`}>{section.title}</div>
  ),
  DashboardSectionGroup: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div data-testid={`section-group`}>
      <h2>{title}</h2>
      {children}
    </div>
  ),
}));

import { useDashboardSummary } from '@/modules/dashboard/hooks';

const mockUseDashboardSummary = vi.mocked(useDashboardSummary);

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------
const mockSummary: DashboardSummary = {
  generatedAt: new Date().toISOString(),
  kpis: [
    { label: 'Custo pessoal previsto', value: 120000, format: 'currency', subtitle: 'Competência 2026-03', trend: 'up' },
    { label: 'Obras impactadas', value: 3, format: 'number', subtitle: '5 centros de custo', trend: 'neutral' },
  ],
  obras: [
    {
      id: 'obra-1',
      title: 'Obra destaque',
      description: 'Descrição obra',
      metrics: [{ label: 'Custo', value: 'R$ 100 mil' }],
      action: { label: 'Abrir', to: '/obras/1' },
    },
  ],
  rh: [
    {
      id: 'rh-1',
      title: 'RH alocações',
      description: 'Desc',
      metrics: [{ label: 'Ativos', value: '10' }],
      action: { label: 'Ir para RH', to: '/rh' },
    },
  ],
  financeiro: [
    {
      id: 'fin-1',
      title: 'Previsto x realizado',
      description: 'Desc',
      metrics: [{ label: 'Previsto', value: 'R$ 100 mil' }],
      action: { label: 'Ver Financeiro', to: '/financeiro' },
    },
  ],
  alertas: [
    {
      id: 'alert-1',
      title: 'Alerta HE',
      description: 'Pendentes',
      severity: 'warning',
      module: 'HE',
    },
  ],
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    mockUseDashboardSummary.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useDashboardSummary>);

    render(<DashboardPage />);

    expect(screen.getByText('Carregando dashboard...')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders error state with retry button', async () => {
    const user = userEvent.setup();
    mockUseDashboardSummary.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useDashboardSummary>);

    render(<DashboardPage />);

    expect(screen.getByText('Erro ao carregar dashboard')).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /tentar novamente/i });
    await user.click(retryBtn);
    expect(refetchMock).toHaveBeenCalled();
  });

  it('renders data state with KPIs and sections', () => {
    mockUseDashboardSummary.mockReturnValue({
      data: mockSummary,
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useDashboardSummary>);

    render(<DashboardPage />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    // KPIs
    expect(screen.getByText('Custo pessoal previsto')).toBeInTheDocument();
    expect(screen.getByText('Obras impactadas')).toBeInTheDocument();
    // Sections
    expect(screen.getByText('Resumo de Obras')).toBeInTheDocument();
    expect(screen.getByText('Resumo de RH')).toBeInTheDocument();
    expect(screen.getByText('Resumo Financeiro e Pessoal')).toBeInTheDocument();
  });

  it('renders refresh button and triggers refetch', async () => {
    const user = userEvent.setup();
    mockUseDashboardSummary.mockReturnValue({
      data: mockSummary,
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: refetchMock,
    } as ReturnType<typeof useDashboardSummary>);

    render(<DashboardPage />);

    const refreshBtn = screen.getByRole('button', { name: /atualizar visão/i });
    await user.click(refreshBtn);
    expect(refetchMock).toHaveBeenCalled();
  });
});
