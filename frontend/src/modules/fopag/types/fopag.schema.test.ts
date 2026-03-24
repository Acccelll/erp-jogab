import { describe, it, expect } from 'vitest';
import { fopagCompetenciaStatusSchema, fopagEventoOrigemSchema } from './fopag.schema';
import { fopagFiltersSchema, defaultFopagFilters } from './fopag-filters.schema';

// ---------------------------------------------------------------------------
// FOPAG Enum Schemas
// ---------------------------------------------------------------------------
describe('fopagCompetenciaStatusSchema', () => {
  it.each(['aberta', 'em_consolidacao', 'pronta_para_rateio', 'fechada_prevista', 'conciliada'])(
    'accepts valid status: %s',
    (status) => {
      expect(fopagCompetenciaStatusSchema.safeParse(status).success).toBe(true);
    },
  );

  it('rejects invalid status', () => {
    expect(fopagCompetenciaStatusSchema.safeParse('invalido').success).toBe(false);
  });

  it('rejects empty string', () => {
    expect(fopagCompetenciaStatusSchema.safeParse('').success).toBe(false);
  });

  it('rejects null', () => {
    expect(fopagCompetenciaStatusSchema.safeParse(null).success).toBe(false);
  });
});

describe('fopagEventoOrigemSchema', () => {
  it.each(['rh', 'horas_extras', 'beneficios', 'provisoes', 'ajuste_manual'])('accepts valid origem: %s', (o) => {
    expect(fopagEventoOrigemSchema.safeParse(o).success).toBe(true);
  });

  it('rejects invalid origem', () => {
    expect(fopagEventoOrigemSchema.safeParse('folha').success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// FOPAG Filters Schema
// ---------------------------------------------------------------------------
describe('fopagFiltersSchema', () => {
  it('accepts empty object (all defaults)', () => {
    const result = fopagFiltersSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.search).toBe('');
    }
  });

  it('accepts valid filter with status', () => {
    const result = fopagFiltersSchema.safeParse({ status: 'aberta' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid status in filter', () => {
    expect(fopagFiltersSchema.safeParse({ status: 'invalido' }).success).toBe(false);
  });

  it('accepts filter with competencia and obraId', () => {
    const result = fopagFiltersSchema.safeParse({
      competencia: '2026-03',
      obraId: 'obra-1',
    });
    expect(result.success).toBe(true);
  });

  it('default filters match expected shape', () => {
    expect(defaultFopagFilters.search).toBe('');
    expect(defaultFopagFilters.status).toBeUndefined();
    expect(defaultFopagFilters.competencia).toBeUndefined();
    expect(defaultFopagFilters.obraId).toBeUndefined();
  });
});
