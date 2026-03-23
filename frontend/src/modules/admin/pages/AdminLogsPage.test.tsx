import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdminLogsPage } from '@/modules/admin/pages/AdminLogsPage';
import type { AdminLog } from '@/modules/admin/types';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
const refetchMock = vi.fn();
const setSearchMock = vi.fn();
const setCategoriaMock = vi.fn();
const setStatusMock = vi.fn();
const setCompetenciaMock = vi.fn();
const clearFiltersMock = vi.fn();

vi.mock('@/modules/admin/hooks', () => ({
  useLogs: vi.fn(),
  useAdminFilters: vi.fn(),
}));

vi.mock('@/shared/components', () => ({
  ContextBar: () => <div data-testid="context-bar" />,
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
  AdminFilters: () => <div data-testid="admin-filters" />,
  AdminPreviewPlaceholder: ({ title }: { title: string }) => (
    <div data-testid="admin-preview">{title}</div>
  ),
  AdminTable: ({ category, rows }: { category: string; rows: string[][] }) => (
    <div data-testid={`admin-table-${category}`}>{rows.length} linhas</div>
  ),
}));

import { useLogs, useAdminFilters } from '@/modules/admin/hooks';

const mockUseLogs = vi.mocked(useLogs);
const mockUseAdminFilters = vi.mocked(useAdminFilters);

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------
const defaultFiltersReturn = {
  filters: { search: '', categoria: undefined, status: undefined, competencia: undefined, obraId: undefined },
  setSearch: setSearchMock,
  setCategoria: setCategoriaMock,
  setStatus: setStatusMock,
  setCompetencia: setCompetenciaMock,
  clearFilters: clearFiltersMock,
  hasActiveFilters: false,
} as ReturnType<typeof useAdminFilters>;

const mockLogs: AdminLog[] = [
  {
    id: 'log-1',
    usuarioNome: 'Admin',
    acao: 'Criou usuário',
    modulo: 'admin',
    entidade: 'Usuário',
    data: '2026-03-20',
    status: 'ativo' as const,
  },
  {
    id: 'log-2',
    usuarioNome: 'Operador',
    acao: 'Atualizou obra',
    modulo: 'obras',
    entidade: 'Obra',
    data: '2026-03-19',
    status: 'ativo' as const,
  },
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('AdminLogsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAdminFilters.mockReturnValue(defaultFiltersReturn);
  });

  it('renders loading state', () => {
    mockUseLogs.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: refetchMock,
    } as ReturnType<typeof useLogs>);

    render(<AdminLogsPage />);

    expect(screen.getByText('Administração · Logs')).toBeInTheDocument();
    expect(screen.getByText(/carregando logs/i)).toBeInTheDocument();
  });

  it('renders error state with retry', async () => {
    const user = userEvent.setup();
    mockUseLogs.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch: refetchMock,
    } as ReturnType<typeof useLogs>);

    render(<AdminLogsPage />);

    expect(screen.getByText('Erro ao carregar logs')).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /tentar novamente/i });
    await user.click(retryBtn);
    expect(refetchMock).toHaveBeenCalled();
  });

  it('renders data state with log table and preview cards', () => {
    mockUseLogs.mockReturnValue({
      data: mockLogs,
      isLoading: false,
      isError: false,
      refetch: refetchMock,
    } as ReturnType<typeof useLogs>);

    render(<AdminLogsPage />);

    // Table with correct rows
    expect(screen.getByTestId('admin-table-logs')).toHaveTextContent('2 linhas');
    // Preview cards for first 2 items
    expect(screen.getByText('Admin · Criou usuário')).toBeInTheDocument();
    expect(screen.getByText('Operador · Atualizou obra')).toBeInTheDocument();
  });

  it('renders nothing in main content when data is undefined and not loading/error', () => {
    mockUseLogs.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      refetch: refetchMock,
    } as ReturnType<typeof useLogs>);

    render(<AdminLogsPage />);

    // Page header is always present
    expect(screen.getByText('Administração · Logs')).toBeInTheDocument();
    // No table, no loading, no error
    expect(screen.queryByTestId('admin-table-logs')).not.toBeInTheDocument();
    expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/erro/i)).not.toBeInTheDocument();
  });
});
