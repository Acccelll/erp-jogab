import { describe, it, expect, vi } from 'vitest';
import { AxiosError, AxiosHeaders } from 'axios';
import {
  unwrapApiResponse,
  normalizeApiError,
  shouldFallbackToMock,
  withApiFallback,
  isHtmlPayload,
  HtmlResponseError,
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

  it('returns the original Error when given a non-Axios error', () => {
    const err = new TypeError('Cannot read property of undefined');
    expect(normalizeApiError(err)).toBe(err);
  });

  it('wraps non-Error values in a generic Error', () => {
    const normalized = normalizeApiError('string error');
    expect(normalized).toBeInstanceOf(Error);
    expect(normalized.message).toBe('Falha inesperada na integração com a API.');
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
});
