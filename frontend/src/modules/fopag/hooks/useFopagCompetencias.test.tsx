import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

// Mock the service
vi.mock('../services/fopag.service', () => ({
  fetchFopagCompetencias: vi.fn(),
}));

import { useFopagCompetencias } from './useFopagCompetencias';
import { fetchFopagCompetencias } from '../services/fopag.service';

const mockFetchFopag = vi.mocked(fetchFopagCompetencias);

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

describe('useFopagCompetencias', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls fetchFopagCompetencias and returns data', async () => {
    const mockData = {
      data: [{ id: 'comp-1', competencia: '2026-03', status: 'aberta' }],
      kpis: { total: 1 },
    };
    mockFetchFopag.mockResolvedValue(mockData as never);

    const { result } = renderHook(() => useFopagCompetencias(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockFetchFopag).toHaveBeenCalledWith(undefined);
    expect(result.current.data).toEqual(mockData);
  });

  it('passes filters to service', async () => {
    mockFetchFopag.mockResolvedValue({ data: [], kpis: {} } as never);

    const filters = { status: 'aberta' as const };
    const { result } = renderHook(() => useFopagCompetencias(filters), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockFetchFopag).toHaveBeenCalledWith(filters);
  });

  it('starts in loading state', () => {
    mockFetchFopag.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useFopagCompetencias(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('handles error state', async () => {
    mockFetchFopag.mockRejectedValue(new Error('Failed'));

    const { result } = renderHook(() => useFopagCompetencias(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
