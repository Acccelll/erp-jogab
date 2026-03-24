import axios, { AxiosError } from 'axios';
import { useAuthStore } from '@/shared/stores/authStore';
import { useContextStore } from '@/shared/stores/contextStore';

/** Instância Axios configurada para a API do ERP JOGAB */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const API_FALLBACK_ENABLED = import.meta.env.VITE_API_FALLBACK !== 'false';

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token ?? localStorage.getItem('token');
  const contexto = useContextStore.getState();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (contexto.empresaId) config.headers['X-Context-Empresa'] = contexto.empresaId;
  if (contexto.filialId) config.headers['X-Context-Filial'] = contexto.filialId;
  if (contexto.obraId) config.headers['X-Context-Obra'] = contexto.obraId;
  if (contexto.centroCustoId) config.headers['X-Context-Centro-Custo'] = contexto.centroCustoId;
  if (contexto.competencia) config.headers['X-Context-Competencia'] = contexto.competencia;

  return config;
});

api.interceptors.response.use(
  (response) => {
    // Detect HTML returned with 200 status (e.g. SPA rewrite on /api routes)
    if (isHtmlPayload(response.data)) {
      return Promise.reject(new HtmlResponseError());
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

interface ApiEnvelope<T> {
  data: T;
}

function isApiEnvelope<T>(value: unknown): value is ApiEnvelope<T> {
  return typeof value === 'object' && value !== null && 'data' in value;
}

/**
 * Detects if a value looks like an HTML page instead of a valid API JSON payload.
 * This happens when Vercel (or another reverse proxy) returns the SPA index.html
 * for an `/api/…` route with status 200.
 */
export function isHtmlPayload(value: unknown): boolean {
  if (typeof value === 'string') {
    const trimmed = value.trimStart().toLowerCase();
    return trimmed.startsWith('<!doctype html') || trimmed.startsWith('<html');
  }
  return false;
}

export class HtmlResponseError extends Error {
  constructor() {
    super('A resposta da API retornou HTML em vez de JSON. Possível problema de roteamento.');
    this.name = 'HtmlResponseError';
  }
}

/** Classifica o tipo de erro para tratamento diferenciado no frontend */
export type ApiErrorType = 'network' | 'timeout' | 'http' | 'html' | 'payload' | 'unknown';

/** Erro estruturado da API com classificação de tipo */
export class ApiError extends Error {
  readonly type: ApiErrorType;
  readonly status?: number;

  constructor(message: string, type: ApiErrorType, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.type = type;
    this.status = status;
  }
}

/** Classifica o tipo de um erro capturado */
export function classifyError(error: unknown): ApiErrorType {
  if (error instanceof HtmlResponseError) return 'html';

  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') return 'timeout';
    if (!error.response) return 'network';
    if (isHtmlPayload(error.response?.data)) return 'html';
    return 'http';
  }

  return 'unknown';
}

export function unwrapApiResponse<T>(payload: T | ApiEnvelope<T>): T {
  if (isHtmlPayload(payload)) {
    throw new HtmlResponseError();
  }
  return isApiEnvelope<T>(payload) ? payload.data : payload;
}

export function normalizeApiError(error: unknown): ApiError {
  const type = classifyError(error);

  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message =
      typeof error.response?.data === 'object' && error.response?.data && 'message' in error.response.data
        ? String(error.response.data.message)
        : error.message;
    return new ApiError(message || 'Falha ao comunicar com a API.', type, status);
  }

  if (error instanceof HtmlResponseError) {
    return new ApiError(error.message, 'html');
  }

  if (error instanceof Error) {
    return new ApiError(error.message, type);
  }

  return new ApiError('Falha inesperada na integração com a API.', type);
}

export function shouldFallbackToMock(error: unknown): boolean {
  if (!API_FALLBACK_ENABLED) {
    return false;
  }

  // HTML returned instead of JSON (e.g. SPA rewrite on /api routes) → fallback to mock
  if (error instanceof HtmlResponseError) {
    return true;
  }

  if (!axios.isAxiosError(error)) {
    return false;
  }

  const status = error.response?.status;
  const hasNoResponse = !error.response;

  // Also detect HTML content in Axios error responses (e.g. proxy returning HTML with error status)
  if (isHtmlPayload(error.response?.data)) {
    return true;
  }

  // Timeout (ECONNABORTED) → fallback to mock
  if (error.code === 'ECONNABORTED') {
    return true;
  }

  return (
    hasNoResponse ||
    status === 404 ||
    status === 405 ||
    status === 501 ||
    status === 502 ||
    status === 503 ||
    status === 504
  );
}

export async function withApiFallback<T>(apiCall: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    if (shouldFallbackToMock(error)) {
      return fallback();
    }

    throw normalizeApiError(error);
  }
}

export type HttpError = AxiosError;
