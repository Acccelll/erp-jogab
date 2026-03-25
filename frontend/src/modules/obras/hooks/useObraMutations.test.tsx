import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

// Mock the service
vi.mock('../services/obras.service', () => ({
  createObra: vi.fn(),
  updateObra: vi.fn(),
}));

import { useCreateObra, useUpdateObra } from './useObraMutations';
import { createObra, updateObra } from '../services/obras.service';

const mockCreateObra = vi.mocked(createObra);
const mockUpdateObra = vi.mocked(updateObra);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useCreateObra', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls createObra and returns mutation response', async () => {
    const mockResponse = {
      message: 'Obra criada com sucesso.',
      obra: { id: 'obra-new', codigo: 'OBR-NEW', nome: 'Nova Obra' },
    };
    mockCreateObra.mockResolvedValue(mockResponse as never);

    const { result } = renderHook(() => useCreateObra(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({
        codigo: 'OBR-NEW',
        nome: 'Nova Obra',
        descricao: '',
        status: 'planejamento',
        tipo: 'residencial',
        clienteId: 'cli-1',
        responsavelId: 'resp-1',
        filialId: 'fil-1',
        endereco: '',
        cidade: 'SP',
        uf: 'SP',
        dataInicio: '2026-01-01',
        dataPrevisaoFim: '2027-12-31',
        orcamentoPrevisto: 100000,
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockCreateObra).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual(mockResponse);
  });

  it('handles creation error', async () => {
    mockCreateObra.mockRejectedValue(new Error('Código duplicado'));

    const { result } = renderHook(() => useCreateObra(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({
        codigo: 'OBR-DUP',
        nome: 'Obra Duplicada',
        descricao: '',
        status: 'planejamento',
        tipo: 'residencial',
        clienteId: 'cli-1',
        responsavelId: 'resp-1',
        filialId: 'fil-1',
        endereco: '',
        cidade: 'SP',
        uf: 'SP',
        dataInicio: '2026-01-01',
        dataPrevisaoFim: '2027-12-31',
        orcamentoPrevisto: 0,
      });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('Código duplicado');
  });
});

describe('useUpdateObra', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls updateObra and returns mutation response', async () => {
    const mockResponse = {
      message: 'Obra atualizada com sucesso.',
      obra: { id: 'obra-1', codigo: 'OBR-001', nome: 'Obra Atualizada' },
    };
    mockUpdateObra.mockResolvedValue(mockResponse as never);

    const { result } = renderHook(() => useUpdateObra(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({
        id: 'obra-1',
        codigo: 'OBR-001',
        nome: 'Obra Atualizada',
        descricao: '',
        status: 'em_andamento',
        tipo: 'comercial',
        clienteId: 'cli-1',
        responsavelId: 'resp-1',
        filialId: 'fil-1',
        endereco: '',
        cidade: 'SP',
        uf: 'SP',
        dataInicio: '2025-01-01',
        dataPrevisaoFim: '2027-06-30',
        orcamentoPrevisto: 2000000,
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockUpdateObra).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual(mockResponse);
  });

  it('handles update error for non-existent obra', async () => {
    mockUpdateObra.mockRejectedValue(new Error('Obra não encontrada'));

    const { result } = renderHook(() => useUpdateObra(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({
        id: 'nonexistent',
        codigo: 'XXX',
        nome: 'Nope',
        descricao: '',
        status: 'planejamento',
        tipo: 'residencial',
        clienteId: 'x',
        responsavelId: 'x',
        filialId: 'x',
        endereco: '',
        cidade: '',
        uf: 'SP',
        dataInicio: '2026-01-01',
        dataPrevisaoFim: '2027-12-31',
        orcamentoPrevisto: 0,
      });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('Obra não encontrada');
  });
});
