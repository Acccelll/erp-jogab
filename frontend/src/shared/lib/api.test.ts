import { describe, it, expect, vi } from 'vitest';
import { AxiosError, AxiosHeaders } from 'axios';
import {
  unwrapApiResponse,
  normalizeApiError,
  shouldFallbackToMock,
  withApiFallback,
  isHtmlPayload,
  HtmlResponseError,
  ApiError,
  classifyError,
} from '@/shared/lib/api';

// ---------------------------------------------------------------------------
// isHtmlPayload
// ---------------------------------------------------------------------------
describe('isHtmlPayload', () => {
  it('detects <!DOCTYPE html> string as HTML', () => {
    expect(isHtmlPayload('<!DOCTYPE html><html><head></head><body></body></html>')).toBe(true);
  });

  it('detects <html> string as HTML', () => {
    expect(isHtmlPayload('<html><head></head><body></body></html>')).toBe(true);
  });

  it('detects HTML with leading whitespace', () => {
    expect(isHtmlPayload('  \n  <!doctype html><html></html>')).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(isHtmlPayload('<!DOCTYPE HTML><HTML></HTML>')).toBe(true);
    expect(isHtmlPayload('<!Doctype Html>')).toBe(true);
  });

  it('returns false for JSON strings', () => {
    expect(isHtmlPayload('{"data": []}')).toBe(false);
  });

  it('returns false for objects', () => {
    expect(isHtmlPayload({ data: [] })).toBe(false);
  });

  it('returns false for arrays', () => {
    expect(isHtmlPayload([1, 2, 3])).toBe(false);
  });

  it('returns false for null/undefined', () => {
    expect(isHtmlPayload(null)).toBe(false);
    expect(isHtmlPayload(undefined)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// unwrapApiResponse
// ---------------------------------------------------------------------------
describe('unwrapApiResponse', () => {
  it('returns inner data when payload is an API envelope', () => {
    const envelope = { data: { id: 1, nome: 'Obra X' } };
    expect(unwrapApiResponse(envelope)).toEqual({ id: 1, nome: 'Obra X' });
  });

  it('returns raw payload when it is NOT an envelope', () => {
    const raw = [1, 2, 3];
    expect(unwrapApiResponse(raw)).toEqual([1, 2, 3]);
  });

  it('returns payload as-is when it is a primitive', () => {
    expect(unwrapApiResponse('hello')).toBe('hello');
    expect(unwrapApiResponse(42)).toBe(42);
  });

  it('throws HtmlResponseError when payload is HTML', () => {
    expect(() => unwrapApiResponse('<!DOCTYPE html><html><body></body></html>')).toThrow(HtmlResponseError);
  });
});

// ---------------------------------------------------------------------------
// normalizeApiError
// ---------------------------------------------------------------------------
describe('normalizeApiError', () => {
  it('extracts message from JSON error response', () => {
    const axiosErr = new AxiosError('Request failed', '400', undefined, undefined, {
      status: 400,
      statusText: 'Bad Request',
      data: { message: 'Campo obrigatório ausente' },
      headers: {},
      config: { headers: new AxiosHeaders() },
    });
    const normalized = normalizeApiError(axiosErr);
    expect(normalized).toBeInstanceOf(Error);
    expect(normalized.message).toBe('Campo obrigatório ausente');
  });

  it('falls back to axios message when response data has no message field', () => {
    const axiosErr = new AxiosError('Network Error', 'ERR_NETWORK');
    const normalized = normalizeApiError(axiosErr);
    expect(normalized.message).toBe('Network Error');
  });

  it('uses generic message when axios error message is empty', () => {
    const axiosErr = new AxiosError('', '500', undefined, undefined, {
      status: 500,
      statusText: 'Internal Server Error',
      data: '<html>error</html>',
      headers: {},
      config: { headers: new AxiosHeaders() },
    });
    const normalized = normalizeApiError(axiosErr);
    expect(normalized.message).toBe('Falha ao comunicar com a API.');
  });

  it('wraps non-Axios Error in an ApiError preserving the message', () => {
    const err = new TypeError('Cannot read property of undefined');
    const normalized = normalizeApiError(err);
    expect(normalized).toBeInstanceOf(ApiError);
    expect(normalized.message).toBe('Cannot read property of undefined');
    expect(normalized.type).toBe('unknown');
  });

  it('wraps non-Error values in a generic ApiError', () => {
    const normalized = normalizeApiError('string error');
    expect(normalized).toBeInstanceOf(ApiError);
    expect(normalized.message).toBe('Falha inesperada na integração com a API.');
    expect(normalized.type).toBe('unknown');
  });
});

// ---------------------------------------------------------------------------
// shouldFallbackToMock
// ---------------------------------------------------------------------------
describe('shouldFallbackToMock', () => {
  it('returns true when there is no response (network error)', () => {
    const axiosErr = new AxiosError('Network Error', 'ERR_NETWORK');
    expect(shouldFallbackToMock(axiosErr)).toBe(true);
  });

  it.each([404, 405, 501, 502, 503, 504])('returns true for status %i', (status) => {
    const axiosErr = new AxiosError('fail', String(status), undefined, undefined, {
      status,
      statusText: '',
      data: null,
      headers: {},
      config: { headers: new AxiosHeaders() },
    });
    expect(shouldFallbackToMock(axiosErr)).toBe(true);
  });

  it('returns false for status 400 (client error)', () => {
    const axiosErr = new AxiosError('fail', '400', undefined, undefined, {
      status: 400,
      statusText: 'Bad Request',
      data: null,
      headers: {},
      config: { headers: new AxiosHeaders() },
    });
    expect(shouldFallbackToMock(axiosErr)).toBe(false);
  });

  it('returns false for non-Axios errors', () => {
    expect(shouldFallbackToMock(new Error('random'))).toBe(false);
  });

  it('returns true for HtmlResponseError (SPA rewrite on /api routes)', () => {
    expect(shouldFallbackToMock(new HtmlResponseError())).toBe(true);
  });

  it('returns true when Axios error response contains HTML data', () => {
    const axiosErr = new AxiosError('fail', '200', undefined, undefined, {
      status: 200,
      statusText: 'OK',
      data: '<!DOCTYPE html><html><body>SPA</body></html>',
      headers: {},
      config: { headers: new AxiosHeaders() },
    });
    expect(shouldFallbackToMock(axiosErr)).toBe(true);
  });

  it('returns true for timeout error (ECONNABORTED)', () => {
    const axiosErr = new AxiosError('timeout of 15000ms exceeded', 'ECONNABORTED');
    expect(shouldFallbackToMock(axiosErr)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// withApiFallback
// ---------------------------------------------------------------------------
describe('withApiFallback', () => {
  it('returns the API result on success', async () => {
    const apiCall = vi.fn().mockResolvedValue({ id: 1 });
    const fallback = vi.fn().mockResolvedValue({ id: 'mock' });

    const result = await withApiFallback(apiCall, fallback);
    expect(result).toEqual({ id: 1 });
    expect(fallback).not.toHaveBeenCalled();
  });

  it('falls back to mock when API returns a network error', async () => {
    const networkErr = new AxiosError('Network Error', 'ERR_NETWORK');
    const apiCall = vi.fn().mockRejectedValue(networkErr);
    const fallback = vi.fn().mockResolvedValue({ id: 'fallback' });

    const result = await withApiFallback(apiCall, fallback);
    expect(result).toEqual({ id: 'fallback' });
    expect(fallback).toHaveBeenCalled();
  });

  it('falls back to mock when API returns 502 (Vercel preview / VITE_API_BASE_URL issue)', async () => {
    const axiosErr = new AxiosError('Bad Gateway', '502', undefined, undefined, {
      status: 502,
      statusText: 'Bad Gateway',
      data: '<html>Vercel preview error</html>',
      headers: {},
      config: { headers: new AxiosHeaders() },
    });
    const apiCall = vi.fn().mockRejectedValue(axiosErr);
    const fallback = vi.fn().mockResolvedValue([]);

    const result = await withApiFallback(apiCall, fallback);
    expect(result).toEqual([]);
    expect(fallback).toHaveBeenCalled();
  });

  it('throws normalized error when API returns 400 (not fallback-eligible)', async () => {
    const axiosErr = new AxiosError('Bad Request', '400', undefined, undefined, {
      status: 400,
      statusText: 'Bad Request',
      data: { message: 'Validação falhou' },
      headers: {},
      config: { headers: new AxiosHeaders() },
    });
    const apiCall = vi.fn().mockRejectedValue(axiosErr);
    const fallback = vi.fn();

    await expect(withApiFallback(apiCall, fallback)).rejects.toThrow('Validação falhou');
    expect(fallback).not.toHaveBeenCalled();
  });

  it('falls back to mock when API returns HTML error page (e.g. proxy 500)', async () => {
    const axiosErr = new AxiosError('Internal Server Error', '500', undefined, undefined, {
      status: 500,
      statusText: 'Internal Server Error',
      data: '<html><body>Internal Server Error</body></html>',
      headers: {},
      config: { headers: new AxiosHeaders() },
    });
    const apiCall = vi.fn().mockRejectedValue(axiosErr);
    const fallback = vi.fn().mockResolvedValue({ id: 'html-fallback' });

    const result = await withApiFallback(apiCall, fallback);
    expect(result).toEqual({ id: 'html-fallback' });
    expect(fallback).toHaveBeenCalled();
  });

  it('falls back to mock when API call throws HtmlResponseError', async () => {
    const apiCall = vi.fn().mockRejectedValue(new HtmlResponseError());
    const fallback = vi.fn().mockResolvedValue({ id: 'mock-fallback' });

    const result = await withApiFallback(apiCall, fallback);
    expect(result).toEqual({ id: 'mock-fallback' });
    expect(fallback).toHaveBeenCalled();
  });

  it('falls back to mock when API call times out (ECONNABORTED)', async () => {
    const timeoutErr = new AxiosError('timeout of 15000ms exceeded', 'ECONNABORTED');
    const apiCall = vi.fn().mockRejectedValue(timeoutErr);
    const fallback = vi.fn().mockResolvedValue({ id: 'timeout-fallback' });

    const result = await withApiFallback(apiCall, fallback);
    expect(result).toEqual({ id: 'timeout-fallback' });
    expect(fallback).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// classifyError
// ---------------------------------------------------------------------------
describe('classifyError', () => {
  it('classifies HtmlResponseError as "html"', () => {
    expect(classifyError(new HtmlResponseError())).toBe('html');
  });

  it('classifies ECONNABORTED as "timeout"', () => {
    expect(classifyError(new AxiosError('timeout', 'ECONNABORTED'))).toBe('timeout');
  });

  it('classifies network error (no response) as "network"', () => {
    expect(classifyError(new AxiosError('Network Error', 'ERR_NETWORK'))).toBe('network');
  });

  it('classifies Axios error with HTML response data as "html"', () => {
    const axiosErr = new AxiosError('fail', '200', undefined, undefined, {
      status: 200,
      statusText: 'OK',
      data: '<!DOCTYPE html><html></html>',
      headers: {},
      config: { headers: new AxiosHeaders() },
    });
    expect(classifyError(axiosErr)).toBe('html');
  });

  it('classifies Axios error with HTTP status as "http"', () => {
    const axiosErr = new AxiosError('fail', '400', undefined, undefined, {
      status: 400,
      statusText: 'Bad Request',
      data: { message: 'validation error' },
      headers: {},
      config: { headers: new AxiosHeaders() },
    });
    expect(classifyError(axiosErr)).toBe('http');
  });

  it('classifies generic Error as "unknown"', () => {
    expect(classifyError(new Error('generic'))).toBe('unknown');
  });

  it('classifies non-Error values as "unknown"', () => {
    expect(classifyError('string')).toBe('unknown');
    expect(classifyError(42)).toBe('unknown');
    expect(classifyError(null)).toBe('unknown');
  });
});

// ---------------------------------------------------------------------------
// ApiError
// ---------------------------------------------------------------------------
describe('ApiError', () => {
  it('preserves message, type, and status', () => {
    const err = new ApiError('test error', 'http', 400);
    expect(err.message).toBe('test error');
    expect(err.type).toBe('http');
    expect(err.status).toBe(400);
    expect(err.name).toBe('ApiError');
  });

  it('is an instance of Error', () => {
    const err = new ApiError('test', 'network');
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(ApiError);
  });

  it('status is undefined when not provided', () => {
    const err = new ApiError('test', 'unknown');
    expect(err.status).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// normalizeApiError — type classification
// ---------------------------------------------------------------------------
describe('normalizeApiError — type classification', () => {
  it('classifies network errors', () => {
    const axiosErr = new AxiosError('Network Error', 'ERR_NETWORK');
    const normalized = normalizeApiError(axiosErr);
    expect(normalized.type).toBe('network');
    expect(normalized.status).toBeUndefined();
  });

  it('classifies timeout errors', () => {
    const axiosErr = new AxiosError('timeout', 'ECONNABORTED');
    const normalized = normalizeApiError(axiosErr);
    expect(normalized.type).toBe('timeout');
  });

  it('classifies HTTP errors with status', () => {
    const axiosErr = new AxiosError('fail', '400', undefined, undefined, {
      status: 400,
      statusText: 'Bad Request',
      data: { message: 'Erro de validação' },
      headers: {},
      config: { headers: new AxiosHeaders() },
    });
    const normalized = normalizeApiError(axiosErr);
    expect(normalized.type).toBe('http');
    expect(normalized.status).toBe(400);
    expect(normalized.message).toBe('Erro de validação');
  });

  it('classifies HtmlResponseError', () => {
    const normalized = normalizeApiError(new HtmlResponseError());
    expect(normalized.type).toBe('html');
  });
});
