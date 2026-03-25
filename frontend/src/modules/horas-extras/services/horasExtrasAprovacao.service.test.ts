import { describe, it, expect } from 'vitest';
import {
  HORAS_EXTRAS_APROVACAO_API_ENDPOINTS,
  normalizeHorasExtrasAprovacaoData,
  fetchHorasExtrasAprovacao,
} from './horasExtrasAprovacao.service';
import type { HorasExtrasAprovacaoData } from '../types';

// ---------------------------------------------------------------------------
// HORAS_EXTRAS_APROVACAO_API_ENDPOINTS
// ---------------------------------------------------------------------------
describe('HORAS_EXTRAS_APROVACAO_API_ENDPOINTS', () => {
  it('defines list endpoint', () => {
    expect(HORAS_EXTRAS_APROVACAO_API_ENDPOINTS.list).toBe('/horas-extras/aprovacao');
  });
});

// ---------------------------------------------------------------------------
// normalizeHorasExtrasAprovacaoData
// ---------------------------------------------------------------------------
describe('normalizeHorasExtrasAprovacaoData', () => {
  it('returns safe defaults for null input', () => {
    const result = normalizeHorasExtrasAprovacaoData(null);
    expect(result.kpis.pendentes).toBe(0);
    expect(result.kpis.emRisco).toBe(0);
    expect(result.kpis.valorPendente).toBe(0);
    expect(result.kpis.obrasImpactadas).toBe(0);
    expect(result.resumoCards).toEqual([]);
    expect(result.aprovacoes).toEqual([]);
    expect(result.historico).toEqual([]);
  });

  it('returns safe defaults for undefined input', () => {
    const result = normalizeHorasExtrasAprovacaoData(undefined);
    expect(result.kpis.pendentes).toBe(0);
    expect(result.aprovacoes).toEqual([]);
  });

  it('returns safe defaults for empty object', () => {
    const result = normalizeHorasExtrasAprovacaoData({});
    expect(result.kpis.pendentes).toBe(0);
    expect(result.resumoCards).toEqual([]);
    expect(result.aprovacoes).toEqual([]);
    expect(result.historico).toEqual([]);
  });

  it('returns safe defaults for partial kpis', () => {
    const result = normalizeHorasExtrasAprovacaoData({
      kpis: { pendentes: 3 } as HorasExtrasAprovacaoData['kpis'],
    });
    expect(result.kpis.pendentes).toBe(3);
    expect(result.kpis.emRisco).toBe(0);
    expect(result.kpis.valorPendente).toBe(0);
    expect(result.kpis.obrasImpactadas).toBe(0);
  });

  it('defaults arrays when not arrays', () => {
    const result = normalizeHorasExtrasAprovacaoData({
      resumoCards: 'invalid' as unknown as HorasExtrasAprovacaoData['resumoCards'],
      aprovacoes: 'invalid' as unknown as HorasExtrasAprovacaoData['aprovacoes'],
      historico: 'invalid' as unknown as HorasExtrasAprovacaoData['historico'],
    });
    expect(result.resumoCards).toEqual([]);
    expect(result.aprovacoes).toEqual([]);
    expect(result.historico).toEqual([]);
  });

  it('preserves valid complete payload', () => {
    const input: HorasExtrasAprovacaoData = {
      kpis: { pendentes: 5, emRisco: 2, valorPendente: 10000, obrasImpactadas: 3 },
      resumoCards: [],
      aprovacoes: [],
      historico: [],
    };
    const result = normalizeHorasExtrasAprovacaoData(input);
    expect(result).toEqual(input);
  });
});

// ---------------------------------------------------------------------------
// fetchHorasExtrasAprovacao (mock fallback)
// ---------------------------------------------------------------------------
describe('fetchHorasExtrasAprovacao (mock fallback)', () => {
  it('returns valid approval data without competencia filter', async () => {
    const result = await fetchHorasExtrasAprovacao();
    expect(result.kpis).toBeDefined();
    expect(typeof result.kpis.pendentes).toBe('number');
    expect(typeof result.kpis.emRisco).toBe('number');
    expect(typeof result.kpis.valorPendente).toBe('number');
    expect(typeof result.kpis.obrasImpactadas).toBe('number');
    expect(Array.isArray(result.resumoCards)).toBe(true);
    expect(Array.isArray(result.aprovacoes)).toBe(true);
    expect(Array.isArray(result.historico)).toBe(true);
  });

  it('accepts optional competencia parameter', async () => {
    const result = await fetchHorasExtrasAprovacao('2025-03');
    expect(result.kpis).toBeDefined();
    expect(Array.isArray(result.aprovacoes)).toBe(true);
  });
});
