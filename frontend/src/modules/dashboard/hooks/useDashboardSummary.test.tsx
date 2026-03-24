import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

// Mock the service
vi.mock('../services/dashboard.service', () => ({
  getDashboardSummary: vi.fn(),
}));

// Mock the store
vi.mock('@/shared/stores', () => ({
  useContextStore: vi.fn(() => ({
    empresaId: 'emp-1',
    filialId: 'fil-1',
    obraId: null,
    competencia: '2026-03',
  })),
}));

import { useDashboardSummary } from './useDashboardSummary';
import { getDashboardSummary } from '../services/dashboard.service';

const mockGetDashboardSummary = vi.mocked(getDashboardSummary);

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

describe('useDashboardSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls getDashboardSummary with context params', async () => {
    const mockData = {
      generatedAt: new Date().toISOString(),
      kpis: [],
      obras: [],
      rh: [],
      financeiro: [],
      alertas: [],
    };
    mockGetDashboardSummary.mockResolvedValue(mockData);

    const { result } = renderHook(() => useDashboardSummary(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockGetDashboardSummary).toHaveBeenCalledWith({
      empresaId: 'emp-1',
      filialId: 'fil-1',
      obraId: null,
      competencia: '2026-03',
    });
    expect(result.current.data).toEqual(mockData);
  });

  it('starts in loading state', () => {
    mockGetDashboardSummary.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useDashboardSummary(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('handles error state', async () => {
    mockGetDashboardSummary.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useDashboardSummary(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeTruthy();
  });
});
