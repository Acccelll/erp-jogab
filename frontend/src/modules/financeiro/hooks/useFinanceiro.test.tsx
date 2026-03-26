import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

vi.mock('../services/financeiro.service', () => ({
  fetchFinanceiroDashboard: vi.fn(),
}));

import { useFinanceiro } from './useFinanceiro';
import { fetchFinanceiroDashboard } from '../services/financeiro.service';
import type { FinanceiroFiltersData } from '../types';

const mockFetch = vi.mocked(fetchFinanceiroDashboard);

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useFinanceiro', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls fetchFinanceiroDashboard and returns data', async () => {
    const mockData = { list: [], kpis: {} };
    mockFetch.mockResolvedValue(mockData as never);
    const { result } = renderHook(() => useFinanceiro(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockFetch).toHaveBeenCalledWith(undefined);
    expect(result.current.data).toEqual(mockData);
  });

  it('passes filters to service', async () => {
    mockFetch.mockResolvedValue({ list: [], kpis: {} } as never);
    const filters: FinanceiroFiltersData = { search: 'test' } as never;
    const { result } = renderHook(() => useFinanceiro(filters), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockFetch).toHaveBeenCalledWith(filters);
  });

  it('starts in loading state', () => {
    mockFetch.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useFinanceiro(), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(true);
  });

  it('handles error state', async () => {
    mockFetch.mockRejectedValue(new Error('Failed'));
    const { result } = renderHook(() => useFinanceiro(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
