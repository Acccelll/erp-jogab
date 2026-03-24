import { api, unwrapApiResponse, withApiFallback } from '@/shared/lib/api';
import type {
  CompraFiltersData,
  ComprasDashboardData,
  CotacaoCompra,
  PedidoCompra,
  PedidoCompraDetalhe,
  SolicitacaoCompra,
} from '../types';
import {
  applyCompraFilters,
  calcularComprasKpis,
  gerarComprasResumoCards,
  gerarComprasStatusResumo,
  mockCotacoesCompra,
  mockPedidoDetalhes,
  mockPedidosCompra,
  mockSolicitacoesCompra,
} from '../data/compras.mock';

export const COMPRAS_API_ENDPOINTS = {
  solicitacoes: '/compras/solicitacoes',
  cotacoes: '/compras/cotacoes',
  pedidos: '/compras/pedidos',
  pedidoDetail: (id: string) => `/compras/pedidos/${id}`,
  dashboard: '/compras/dashboard',
} as const;

function delay(ms = 250): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchSolicitacoesCompraMock(filters?: CompraFiltersData): Promise<SolicitacaoCompra[]> {
  await delay();
  return applyCompraFilters(mockSolicitacoesCompra, filters);
}

async function fetchCotacoesCompraMock(filters?: CompraFiltersData): Promise<CotacaoCompra[]> {
  await delay();
  return applyCompraFilters(mockCotacoesCompra, filters);
}

async function fetchPedidosCompraMock(filters?: CompraFiltersData): Promise<PedidoCompra[]> {
  await delay();
  return applyCompraFilters(mockPedidosCompra, filters);
}

async function fetchPedidoCompraByIdMock(id: string): Promise<PedidoCompraDetalhe | null> {
  await delay(180);
  return mockPedidoDetalhes[id] ?? null;
}

async function fetchComprasDashboardMock(filters?: CompraFiltersData): Promise<ComprasDashboardData> {
  const [solicitacoes, cotacoes, pedidos] = await Promise.all([
    fetchSolicitacoesCompraMock(filters),
    fetchCotacoesCompraMock(filters),
    fetchPedidosCompraMock(filters),
  ]);

  return {
    solicitacoes,
    cotacoes,
    pedidos,
    kpis: calcularComprasKpis(solicitacoes, cotacoes, pedidos),
    resumoCards: gerarComprasResumoCards(solicitacoes, cotacoes, pedidos),
    statusResumo: gerarComprasStatusResumo(pedidos),
  };
}

export async function fetchSolicitacoesCompra(filters?: CompraFiltersData): Promise<SolicitacaoCompra[]> {
  return withApiFallback(
    async () => {
      const response = await api.get(COMPRAS_API_ENDPOINTS.solicitacoes, { params: filters });
      return unwrapApiResponse<SolicitacaoCompra[]>(response.data);
    },
    () => fetchSolicitacoesCompraMock(filters),
  );
}

export async function fetchCotacoesCompra(filters?: CompraFiltersData): Promise<CotacaoCompra[]> {
  return withApiFallback(
    async () => {
      const response = await api.get(COMPRAS_API_ENDPOINTS.cotacoes, { params: filters });
      return unwrapApiResponse<CotacaoCompra[]>(response.data);
    },
    () => fetchCotacoesCompraMock(filters),
  );
}

export async function fetchPedidosCompra(filters?: CompraFiltersData): Promise<PedidoCompra[]> {
  return withApiFallback(
    async () => {
      const response = await api.get(COMPRAS_API_ENDPOINTS.pedidos, { params: filters });
      return unwrapApiResponse<PedidoCompra[]>(response.data);
    },
    () => fetchPedidosCompraMock(filters),
  );
}

export async function fetchPedidoCompraById(id: string): Promise<PedidoCompraDetalhe | null> {
  return withApiFallback(
    async () => {
      const response = await api.get(COMPRAS_API_ENDPOINTS.pedidoDetail(id));
      return unwrapApiResponse<PedidoCompraDetalhe | null>(response.data);
    },
    () => fetchPedidoCompraByIdMock(id),
  );
}

export async function fetchComprasDashboard(filters?: CompraFiltersData): Promise<ComprasDashboardData> {
  return withApiFallback(
    async () => {
      const response = await api.get(COMPRAS_API_ENDPOINTS.dashboard, { params: filters });
      return unwrapApiResponse<ComprasDashboardData>(response.data);
    },
    () => fetchComprasDashboardMock(filters),
  );
}
