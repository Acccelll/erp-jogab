import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

// Mock the service
vi.mock('../services/compras.service', () => ({
  fetchComprasDashboard: vi.fn(),
}));

import { useCompras } from './useCompras';
import { fetchComprasDashboard } from '../services/compras.service';

const mockFetchCompras = vi.mocked(fetchComprasDashboard);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useCompras', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls fetchComprasDashboard and returns data', async () => {
    const mockData = {
      list: [{ id: 'compra-1', descricao: 'Cimento' }],
      kpis: { totalSolicitacoes: 1 },
      resumoCards: [],
    };
    mockFetchCompras.mockResolvedValue(mockData as never);

    const { result } = renderHook(() => useCompras(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockFetchCompras).toHaveBeenCalledWith(undefined);
    expect(result.current.data).toEqual(mockData);
  });

  it('passes filters to service', async () => {
    mockFetchCompras.mockResolvedValue({ list: [], kpis: {}, resumoCards: [] } as never);

    const filters = { search: 'cimento', status: 'em_cotacao' as const };
    const { result } = renderHook(() => useCompras(filters), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockFetchCompras).toHaveBeenCalledWith(filters);
  });

  it('starts in loading state', () => {
    mockFetchCompras.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useCompras(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('handles error state', async () => {
    mockFetchCompras.mockRejectedValue(new Error('Failed'));

    const { result } = renderHook(() => useCompras(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
