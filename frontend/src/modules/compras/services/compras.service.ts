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

function delay(ms = 250): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchSolicitacoesCompra(filters?: CompraFiltersData): Promise<SolicitacaoCompra[]> {
  await delay();
  return applyCompraFilters(mockSolicitacoesCompra, filters);
}

export async function fetchCotacoesCompra(filters?: CompraFiltersData): Promise<CotacaoCompra[]> {
  await delay();
  return applyCompraFilters(mockCotacoesCompra, filters);
}

export async function fetchPedidosCompra(filters?: CompraFiltersData): Promise<PedidoCompra[]> {
  await delay();
  return applyCompraFilters(mockPedidosCompra, filters);
}

export async function fetchPedidoCompraById(id: string): Promise<PedidoCompraDetalhe | null> {
  await delay(180);
  return mockPedidoDetalhes[id] ?? null;
}

export async function fetchComprasDashboard(filters?: CompraFiltersData): Promise<ComprasDashboardData> {
  const [solicitacoes, cotacoes, pedidos] = await Promise.all([
    fetchSolicitacoesCompra(filters),
    fetchCotacoesCompra(filters),
    fetchPedidosCompra(filters),
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
