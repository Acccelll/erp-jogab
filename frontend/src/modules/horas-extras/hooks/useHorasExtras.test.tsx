import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

// Mock the service
vi.mock('../services/horasExtras.service', () => ({
  fetchHorasExtras: vi.fn(),
}));

import { useHorasExtras } from './useHorasExtras';
import { fetchHorasExtras } from '../services/horasExtras.service';

const mockFetchHorasExtras = vi.mocked(fetchHorasExtras);

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

describe('useHorasExtras', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls fetchHorasExtras and returns data', async () => {
    const mockData = {
      list: [{ id: 'he-1', funcionarioNome: 'João' }],
      kpis: { totalLancamentos: 1 },
      resumoCards: [],
      fechamentoAtual: null,
    };
    mockFetchHorasExtras.mockResolvedValue(mockData as never);

    const { result } = renderHook(() => useHorasExtras(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockFetchHorasExtras).toHaveBeenCalledWith(undefined);
    expect(result.current.data).toEqual(mockData);
  });

  it('passes filters to service', async () => {
    mockFetchHorasExtras.mockResolvedValue({ list: [], kpis: {}, resumoCards: [], fechamentoAtual: null } as never);

    const filters = { search: 'João' };
    const { result } = renderHook(() => useHorasExtras(filters as never), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockFetchHorasExtras).toHaveBeenCalledWith(filters);
  });

  it('starts in loading state', () => {
    mockFetchHorasExtras.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useHorasExtras(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('handles error state', async () => {
    mockFetchHorasExtras.mockRejectedValue(new Error('Failed'));

    const { result } = renderHook(() => useHorasExtras(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
