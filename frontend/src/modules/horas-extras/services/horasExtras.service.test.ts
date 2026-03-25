import { describe, it, expect } from 'vitest';
import {
  HORAS_EXTRAS_API_ENDPOINTS,
  fetchHorasExtras,
  fetchHoraExtraById,
  fetchFechamentosCompetencia,
  fetchHorasExtrasDashboard,
  normalizeHorasExtrasDashboardData,
  approveHoraExtra,
  fecharCompetenciaHorasExtras,
} from './horasExtras.service';
import type { HorasExtrasDashboardData } from '../types';

// ---------------------------------------------------------------------------
// HORAS_EXTRAS_API_ENDPOINTS
// ---------------------------------------------------------------------------
describe('HORAS_EXTRAS_API_ENDPOINTS', () => {
  it('defines list endpoint', () => {
    expect(HORAS_EXTRAS_API_ENDPOINTS.list).toBe('/horas-extras');
  });

  it('defines detail endpoint with id', () => {
    expect(HORAS_EXTRAS_API_ENDPOINTS.detail('he-1')).toBe('/horas-extras/he-1');
  });

  it('defines dashboard endpoint', () => {
    expect(HORAS_EXTRAS_API_ENDPOINTS.dashboard).toBe('/horas-extras/dashboard');
  });

  it('defines aprovar endpoint with id', () => {
    expect(HORAS_EXTRAS_API_ENDPOINTS.aprovar('he-1')).toBe('/horas-extras/he-1/aprovar');
  });

  it('defines fechamento endpoint', () => {
    expect(HORAS_EXTRAS_API_ENDPOINTS.fechamento).toBe('/horas-extras/fechamento');
  });

  it('defines fechamentos endpoint', () => {
    expect(HORAS_EXTRAS_API_ENDPOINTS.fechamentos).toBe('/horas-extras/fechamentos');
  });
});

// ---------------------------------------------------------------------------
// normalizeHorasExtrasDashboardData
// ---------------------------------------------------------------------------
describe('normalizeHorasExtrasDashboardData', () => {
  it('returns safe defaults for null input', () => {
    const result = normalizeHorasExtrasDashboardData(null);
    expect(result.list).toEqual([]);
    expect(result.kpis.totalLancamentos).toBe(0);
    expect(result.kpis.pendentesAprovacao).toBe(0);
    expect(result.kpis.aprovadas).toBe(0);
    expect(result.kpis.fechadasParaFopag).toBe(0);
    expect(result.kpis.horasTotais).toBe(0);
    expect(result.kpis.valorTotal).toBe(0);
    expect(result.resumoCards).toEqual([]);
    expect(result.fechamentoAtual).toBeNull();
  });

  it('returns safe defaults for undefined input', () => {
    const result = normalizeHorasExtrasDashboardData(undefined);
    expect(result.list).toEqual([]);
    expect(result.kpis.totalLancamentos).toBe(0);
  });

  it('returns safe defaults for empty object', () => {
    const result = normalizeHorasExtrasDashboardData({});
    expect(result.list).toEqual([]);
    expect(result.kpis.totalLancamentos).toBe(0);
    expect(result.resumoCards).toEqual([]);
    expect(result.fechamentoAtual).toBeNull();
  });

  it('returns safe defaults for partial kpis', () => {
    const result = normalizeHorasExtrasDashboardData({
      kpis: { totalLancamentos: 5 } as HorasExtrasDashboardData['kpis'],
    });
    expect(result.kpis.totalLancamentos).toBe(5);
    expect(result.kpis.pendentesAprovacao).toBe(0);
    expect(result.kpis.aprovadas).toBe(0);
    expect(result.kpis.fechadasParaFopag).toBe(0);
    expect(result.kpis.horasTotais).toBe(0);
    expect(result.kpis.valorTotal).toBe(0);
  });

  it('defaults list to empty array when not an array', () => {
    const result = normalizeHorasExtrasDashboardData({
      list: 'not-an-array' as unknown as HorasExtrasDashboardData['list'],
    });
    expect(result.list).toEqual([]);
  });

  it('defaults resumoCards to empty array when not an array', () => {
    const result = normalizeHorasExtrasDashboardData({
      resumoCards: 'not-an-array' as unknown as HorasExtrasDashboardData['resumoCards'],
    });
    expect(result.resumoCards).toEqual([]);
  });

  it('preserves valid complete payload', () => {
    const input: HorasExtrasDashboardData = {
      list: [],
      kpis: {
        totalLancamentos: 10,
        pendentesAprovacao: 3,
        aprovadas: 5,
        fechadasParaFopag: 2,
        horasTotais: 120,
        valorTotal: 15000,
      },
      resumoCards: [],
      fechamentoAtual: null,
    };
    const result = normalizeHorasExtrasDashboardData(input);
    expect(result).toEqual(input);
  });
});

// ---------------------------------------------------------------------------
// fetchHorasExtras (mock fallback)
// ---------------------------------------------------------------------------
describe('fetchHorasExtras (mock fallback)', () => {
  it('returns a valid response without filters', async () => {
    const result = await fetchHorasExtras();
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.kpis).toBeDefined();
    expect(result.kpis.totalLancamentos).toBeGreaterThan(0);
    expect(Array.isArray(result.resumoCards)).toBe(true);
  });

  it('filters by status', async () => {
    const result = await fetchHorasExtras({ status: 'aprovada' });
    for (const item of result.data) {
      expect(item.status).toBe('aprovada');
    }
  });

  it('returns empty data for non-matching search', async () => {
    const result = await fetchHorasExtras({ search: 'XXXYYY_NONEXISTENT_HE_ZZZ' });
    expect(result.data).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// fetchHoraExtraById (mock fallback)
// ---------------------------------------------------------------------------
describe('fetchHoraExtraById (mock fallback)', () => {
  it('returns a hora extra for a valid ID', async () => {
    const list = await fetchHorasExtras();
    const heId = list.data[0].id;
    const he = await fetchHoraExtraById(heId);
    expect(he).toBeDefined();
    expect(he?.id).toBe(heId);
  });

  it('returns null for a non-existent ID', async () => {
    const he = await fetchHoraExtraById('nonexistent-he-xyz');
    expect(he).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// fetchFechamentosCompetencia (mock fallback)
// ---------------------------------------------------------------------------
describe('fetchFechamentosCompetencia (mock fallback)', () => {
  it('returns an array of fechamentos', async () => {
    const result = await fetchFechamentosCompetencia();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    for (const f of result) {
      expect(f.competencia).toBeDefined();
      expect(f.status).toBeDefined();
    }
  });
});

// ---------------------------------------------------------------------------
// fetchHorasExtrasDashboard (mock fallback)
// ---------------------------------------------------------------------------
describe('fetchHorasExtrasDashboard (mock fallback)', () => {
  it('returns a valid dashboard response', async () => {
    const result = await fetchHorasExtrasDashboard();
    expect(Array.isArray(result.list)).toBe(true);
    expect(result.kpis).toBeDefined();
    expect(result.kpis.totalLancamentos).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(result.resumoCards)).toBe(true);
  });

  it('accepts optional filters', async () => {
    const result = await fetchHorasExtrasDashboard({ status: 'aprovada' });
    expect(Array.isArray(result.list)).toBe(true);
    expect(result.kpis).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// approveHoraExtra (mock fallback)
// ---------------------------------------------------------------------------
describe('approveHoraExtra (mock fallback)', () => {
  it('approves a pendente hora extra and returns success', async () => {
    const list = await fetchHorasExtras({ status: 'pendente_aprovacao' });
    if (list.data.length === 0) return; // skip if no pendente

    const heId = list.data[0].id;
    const result = await approveHoraExtra(heId);
    expect(result.message).toBeDefined();
    expect(result.lancamento).toBeDefined();
    expect(result.lancamento.id).toBe(heId);
    expect(result.lancamento.status).toBe('aprovada');
  });
});

// ---------------------------------------------------------------------------
// fecharCompetenciaHorasExtras (mock fallback)
// ---------------------------------------------------------------------------
describe('fecharCompetenciaHorasExtras (mock fallback)', () => {
  it('closes a competência and returns fechamento data', async () => {
    const fechamentos = await fetchFechamentosCompetencia();
    const aberta = fechamentos.find((f) => f.status === 'aberta' || f.status === 'em_andamento');
    if (!aberta) return; // skip if no open competência

    const result = await fecharCompetenciaHorasExtras(aberta.competencia);
    expect(result.message).toBeDefined();
    expect(result.fechamento).toBeDefined();
    expect(result.fechamento.competencia).toBe(aberta.competencia);
  });
});
