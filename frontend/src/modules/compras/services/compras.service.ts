import { api, unwrapApiResponse, withApiFallback } from '@/shared/lib/api';
import type {
  CompraCategoria,
  CompraFiltersData,
  CompraPrioridade,
  ComprasDashboardData,
  ComprasKpis,
  CompraStatus,
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

const EMPTY_KPIS: ComprasKpis = {
  totalSolicitacoes: 0,
  solicitacoesPendentes: 0,
  cotacoesEmAberto: 0,
  pedidosEmitidos: 0,
  valorComprometido: 0,
  valorAguardandoFiscal: 0,
};

/** Ensures the API payload always conforms to a complete ComprasDashboardData. */
export function normalizeComprasDashboardData(
  payload: Partial<ComprasDashboardData> | null | undefined,
): ComprasDashboardData {
  return {
    solicitacoes: Array.isArray(payload?.solicitacoes) ? payload.solicitacoes : [],
    cotacoes: Array.isArray(payload?.cotacoes) ? payload.cotacoes : [],
    pedidos: Array.isArray(payload?.pedidos) ? payload.pedidos : [],
    kpis: payload?.kpis ? { ...EMPTY_KPIS, ...payload.kpis } : EMPTY_KPIS,
    resumoCards: Array.isArray(payload?.resumoCards) ? payload.resumoCards : [],
    statusResumo: Array.isArray(payload?.statusResumo) ? payload.statusResumo : [],
  };
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
      const raw = unwrapApiResponse<ComprasDashboardData>(response.data);
      return normalizeComprasDashboardData(raw);
    },
    () => fetchComprasDashboardMock(filters),
  );
}

export interface CreateSolicitacaoPayload {
  titulo: string;
  descricao: string;
  obraId: string;
  categoria: CompraCategoria;
  prioridade: CompraPrioridade;
  valorEstimado: number;
  prazoNecessidade: string;
  itens: number;
}

export interface UpdateSolicitacaoPayload {
  titulo?: string;
  descricao?: string;
  prioridade?: CompraPrioridade;
  valorEstimado?: number;
  prazoNecessidade?: string;
  status?: CompraStatus;
}

export interface CreateCotacaoPayload {
  solicitacaoId: string;
  objeto: string;
  obraId: string;
  categoria: CompraCategoria;
  fornecedorPrincipal: string;
  valorCotado: number;
  melhorPrazoEntrega: string;
}

export interface UpdateCotacaoPayload {
  objeto?: string;
  fornecedorPrincipal?: string;
  valorCotado?: number;
  melhorPrazoEntrega?: string;
  status?: CompraStatus;
}

export interface CreatePedidoPayload {
  solicitacaoId: string;
  cotacaoId?: string;
  fornecedorId: string;
  fornecedorNome: string;
  obraId: string;
  categoria: CompraCategoria;
  prioridade: CompraPrioridade;
  valorPedido: number;
  previsaoEntrega: string;
}

export interface UpdatePedidoPayload {
  status?: CompraStatus;
  previsaoEntrega?: string;
  valorPedido?: number;
  observacao?: string;
}

export async function createSolicitacao(payload: CreateSolicitacaoPayload): Promise<SolicitacaoCompra> {
  return withApiFallback(
    async () => {
      const response = await api.post(COMPRAS_API_ENDPOINTS.solicitacoes, payload);
      return unwrapApiResponse<SolicitacaoCompra>(response.data);
    },
    () =>
      Promise.resolve({
        id: crypto.randomUUID(),
        codigo: `SOL-${Date.now()}`,
        ...payload,
        solicitanteNome: 'Usuário',
        obraNome: payload.obraId,
        centroCustoNome: 'Centro Custo',
        competencia: new Date().toISOString().slice(0, 7),
        status: 'rascunho' as CompraStatus,
        createdAt: new Date().toISOString(),
        integracaoFiscal: false,
        integracaoFinanceiro: false,
      }),
  );
}

export async function updateSolicitacao(id: string, payload: UpdateSolicitacaoPayload): Promise<SolicitacaoCompra> {
  return withApiFallback(
    async () => {
      const response = await api.put(`${COMPRAS_API_ENDPOINTS.solicitacoes}/${id}`, payload);
      return unwrapApiResponse<SolicitacaoCompra>(response.data);
    },
    () => fetchSolicitacoesCompra().then((list) => list.find((s) => s.id === id) ?? list[0]),
  );
}

export async function createCotacao(payload: CreateCotacaoPayload): Promise<CotacaoCompra> {
  return withApiFallback(
    async () => {
      const response = await api.post(COMPRAS_API_ENDPOINTS.cotacoes, payload);
      return unwrapApiResponse<CotacaoCompra>(response.data);
    },
    () =>
      Promise.resolve({
        id: crypto.randomUUID(),
        codigo: `COT-${Date.now()}`,
        ...payload,
        prioridade: 'media' as CompraPrioridade,
        obraNome: payload.obraId,
        competencia: new Date().toISOString().slice(0, 7),
        quantidadeFornecedores: 1,
        status: 'em_cotacao' as CompraStatus,
        createdAt: new Date().toISOString(),
      }),
  );
}

export async function updateCotacao(id: string, payload: UpdateCotacaoPayload): Promise<CotacaoCompra> {
  return withApiFallback(
    async () => {
      const response = await api.put(`${COMPRAS_API_ENDPOINTS.cotacoes}/${id}`, payload);
      return unwrapApiResponse<CotacaoCompra>(response.data);
    },
    () => fetchCotacoesCompra().then((list) => list.find((c) => c.id === id) ?? list[0]),
  );
}

export async function createPedido(payload: CreatePedidoPayload): Promise<PedidoCompra> {
  return withApiFallback(
    async () => {
      const response = await api.post(COMPRAS_API_ENDPOINTS.pedidos, payload);
      return unwrapApiResponse<PedidoCompra>(response.data);
    },
    () =>
      Promise.resolve({
        id: crypto.randomUUID(),
        codigo: `PED-${Date.now()}`,
        cotacaoId: payload.cotacaoId ?? null,
        ...payload,
        obraNome: payload.obraId,
        centroCustoNome: 'Centro Custo',
        competencia: new Date().toISOString().slice(0, 7),
        status: 'pedido_emitido' as CompraStatus,
        valorComprometidoFinanceiro: payload.valorPedido,
        fiscalStatus: 'nao_iniciado' as const,
        financeiroStatus: 'nao_programado' as const,
        itens: 0,
        createdAt: new Date().toISOString(),
      }),
  );
}

export async function updatePedido(id: string, payload: UpdatePedidoPayload): Promise<PedidoCompra> {
  return withApiFallback(
    async () => {
      const response = await api.put(`${COMPRAS_API_ENDPOINTS.pedidos}/${id}`, payload);
      return unwrapApiResponse<PedidoCompra>(response.data);
    },
    () => fetchPedidosCompra().then((list) => list.find((p) => p.id === id) ?? list[0]),
  );
}
