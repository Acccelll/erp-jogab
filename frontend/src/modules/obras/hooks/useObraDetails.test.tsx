import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

// Mock the service
vi.mock('../services/obras.service', () => ({
  fetchObraDetail: vi.fn(),
}));

import { useObraDetails } from './useObraDetails';
import { fetchObraDetail } from '../services/obras.service';

const mockFetchObraDetail = vi.mocked(fetchObraDetail);

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

describe('useObraDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns loading state initially', () => {
    mockFetchObraDetail.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useObraDetails('obra-1'), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.obra).toBeNull();
  });

  it('does not fetch when obraId is undefined', () => {
    const { result } = renderHook(() => useObraDetails(undefined), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.obra).toBeNull();
    expect(mockFetchObraDetail).not.toHaveBeenCalled();
  });

  it('returns obra detail data on success', async () => {
    const mockData = {
      obra: {
        id: 'obra-1',
        codigo: 'OBR-001',
        nome: 'Obra Teste',
        status: 'em_andamento' as const,
        tipo: 'residencial' as const,
      },
      kpis: {
        orcamento: 500000,
        custo: 200000,
        saldo: 300000,
        percentual: 40,
        diasRestantes: 365,
        totalEquipe: 15,
        totalContratos: 3,
      },
      resumoBlocos: [
        {
          titulo: 'Financeiro',
          itens: [{ label: 'Orçamento', valor: 'R$ 500.000' }],
        },
      ],
    };

    mockFetchObraDetail.mockResolvedValue(mockData as never);

    const { result } = renderHook(() => useObraDetails('obra-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.obra).toEqual(mockData.obra);
    expect(result.current.kpis).toEqual(mockData.kpis);
    expect(result.current.resumoBlocos).toEqual(mockData.resumoBlocos);
    expect(result.current.isError).toBe(false);
  });

  it('handles error state', async () => {
    mockFetchObraDetail.mockRejectedValue(new Error('Obra não encontrada'));

    const { result } = renderHook(() => useObraDetails('obra-bad'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.obra).toBeNull();
    expect(result.current.error).toBeTruthy();
  });

  it('defaults resumoBlocos to empty array when missing', async () => {
    mockFetchObraDetail.mockResolvedValue({
      obra: { id: 'obra-1' },
      kpis: null,
      resumoBlocos: undefined,
    } as never);

    const { result } = renderHook(() => useObraDetails('obra-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.resumoBlocos).toEqual([]);
  });
});
