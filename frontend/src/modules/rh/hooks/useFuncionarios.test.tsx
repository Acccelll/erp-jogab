import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

// Mock the service
vi.mock('../services/funcionarios.service', () => ({
  fetchFuncionarios: vi.fn(),
}));

import { useFuncionarios } from './useFuncionarios';
import { fetchFuncionarios } from '../services/funcionarios.service';

const mockFetchFuncionarios = vi.mocked(fetchFuncionarios);

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

describe('useFuncionarios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls fetchFuncionarios and returns data', async () => {
    const mockData = {
      data: [{ id: 'func-1', nome: 'João Silva', matricula: 'MAT-001' }],
      kpis: { total: 1, ativos: 1 },
    };
    mockFetchFuncionarios.mockResolvedValue(mockData as never);

    const { result } = renderHook(() => useFuncionarios(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockFetchFuncionarios).toHaveBeenCalledWith(undefined);
    expect(result.current.data).toEqual(mockData);
  });

  it('passes filters to fetchFuncionarios', async () => {
    mockFetchFuncionarios.mockResolvedValue({ data: [], kpis: {} } as never);

    const filters = { search: 'João', status: 'ativo' as const };
    const { result } = renderHook(() => useFuncionarios(filters), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockFetchFuncionarios).toHaveBeenCalledWith(filters);
  });

  it('starts in loading state', () => {
    mockFetchFuncionarios.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useFuncionarios(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('handles error state', async () => {
    mockFetchFuncionarios.mockRejectedValue(new Error('Failed'));

    const { result } = renderHook(() => useFuncionarios(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
