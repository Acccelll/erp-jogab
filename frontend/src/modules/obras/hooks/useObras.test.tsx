import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

// Mock the service
vi.mock('../services/obras.service', () => ({
  fetchObras: vi.fn(),
}));

import { useObras } from './useObras';
import { fetchObras } from '../services/obras.service';

const mockFetchObras = vi.mocked(fetchObras);

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

describe('useObras', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls fetchObras and returns data', async () => {
    const mockData = {
      data: [{ id: 'obra-1', codigo: 'OBR-001', nome: 'Obra Teste' }],
      kpis: { total: 1, emAndamento: 1, concluidas: 0 },
    };
    mockFetchObras.mockResolvedValue(mockData as never);

    const { result } = renderHook(() => useObras(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockFetchObras).toHaveBeenCalledWith(undefined);
    expect(result.current.data).toEqual(mockData);
  });

  it('passes filters to fetchObras', async () => {
    mockFetchObras.mockResolvedValue({ data: [], kpis: {} } as never);

    const filters = { search: 'teste', status: 'em_andamento' as const };
    const { result } = renderHook(() => useObras(filters), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockFetchObras).toHaveBeenCalledWith(filters);
  });

  it('starts in loading state', () => {
    mockFetchObras.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useObras(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('handles error state', async () => {
    mockFetchObras.mockRejectedValue(new Error('Failed'));

    const { result } = renderHook(() => useObras(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
