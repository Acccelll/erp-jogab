import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

vi.mock('../services/admin.service', () => ({
  fetchAdminDashboard: vi.fn(),
}));

import { useAdmin } from './useAdmin';
import { fetchAdminDashboard } from '../services/admin.service';
import type { AdminFiltersData } from '../types';

const mockFetch = vi.mocked(fetchAdminDashboard);

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls fetchAdminDashboard and returns data', async () => {
    const mockData = { list: [], kpis: {} };
    mockFetch.mockResolvedValue(mockData as never);
    const { result } = renderHook(() => useAdmin(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockFetch).toHaveBeenCalledWith(undefined);
    expect(result.current.data).toEqual(mockData);
  });

  it('passes filters to service', async () => {
    mockFetch.mockResolvedValue({ list: [], kpis: {} } as never);
    const filters: AdminFiltersData = { search: 'test' } as never;
    const { result } = renderHook(() => useAdmin(filters), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockFetch).toHaveBeenCalledWith(filters);
  });

  it('starts in loading state', () => {
    mockFetch.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useAdmin(), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(true);
  });

  it('handles error state', async () => {
    mockFetch.mockRejectedValue(new Error('Failed'));
    const { result } = renderHook(() => useAdmin(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
