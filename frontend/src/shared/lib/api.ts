import axios, { AxiosError } from 'axios';
import { useAuthStore } from '@/shared/stores/authStore';
import { useContextStore } from '@/shared/stores/contextStore';

/** Instância Axios configurada para a API do ERP JOGAB */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
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

export function unwrapApiResponse<T>(payload: T | ApiEnvelope<T>): T {
  if (isHtmlPayload(payload)) {
    throw new HtmlResponseError();
  }
  return isApiEnvelope<T>(payload) ? payload.data : payload;
}

export function normalizeApiError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const message =
      typeof error.response?.data === 'object' && error.response?.data && 'message' in error.response.data
        ? String(error.response.data.message)
        : error.message;
    return new Error(message || 'Falha ao comunicar com a API.');
  }

  return error instanceof Error ? error : new Error('Falha inesperada na integração com a API.');
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
