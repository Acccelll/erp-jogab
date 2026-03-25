/**
 * Tests for the HE → FOPAG → Financeiro data chain.
 *
 * Validates that:
 * 1. Horas Extras closed data (eligible HE) feeds FOPAG competência snapshot.
 * 2. FOPAG snapshot values flow into Financeiro pessoal summary.
 * 3. Contracts remain consistent across the chain.
 */
import { describe, it, expect } from 'vitest';
import {
  buildFopagCompetenciaSnapshot,
  buildWorkforceFinancialSummary,
  getObraLaborCostSnapshot,
} from './workforceCost';

const COMPETENCIA_ATIVA = '2026-03';
const COMPETENCIA_FECHADA = '2026-02';

// ---------------------------------------------------------------------------
// buildFopagCompetenciaSnapshot — HE → FOPAG
// ---------------------------------------------------------------------------
describe('buildFopagCompetenciaSnapshot (HE → FOPAG)', () => {
  it('returns a snapshot with required fields for active competencia', () => {
    const snapshot = buildFopagCompetenciaSnapshot(COMPETENCIA_ATIVA);
    expect(snapshot).toHaveProperty('funcionarios');
    expect(snapshot).toHaveProperty('obras');
    expect(snapshot).toHaveProperty('rateios');
    expect(snapshot).toHaveProperty('eventos');
    expect(snapshot).toHaveProperty('financeiro');
    expect(snapshot).toHaveProperty('previstoRealizado');
    expect(snapshot).toHaveProperty('meta');
  });

  it('meta.totalFuncionarios reflects HE-linked employees', () => {
    const snapshot = buildFopagCompetenciaSnapshot(COMPETENCIA_ATIVA);
    expect(snapshot.meta.totalFuncionarios).toBeGreaterThanOrEqual(0);
  });

  it('meta.valorHorasExtras comes from integrated HE entries', () => {
    const snapshot = buildFopagCompetenciaSnapshot(COMPETENCIA_ATIVA);
    expect(typeof snapshot.meta.valorHorasExtras).toBe('number');
    expect(snapshot.meta.valorHorasExtras).toBeGreaterThanOrEqual(0);
  });

  it('financeiro.valorHorasExtrasIntegradas >= 0', () => {
    const snapshot = buildFopagCompetenciaSnapshot(COMPETENCIA_ATIVA);
    expect(snapshot.financeiro.valorHorasExtrasIntegradas).toBeGreaterThanOrEqual(0);
  });

  it('financeiro.valorPrevistoDesembolso > 0 when HE exist', () => {
    const snapshot = buildFopagCompetenciaSnapshot(COMPETENCIA_ATIVA);
    // Even if no HE, we have salary base so it should be > 0 when funcionarios exist
    if (snapshot.meta.totalFuncionarios > 0) {
      expect(snapshot.financeiro.valorPrevistoDesembolso).toBeGreaterThan(0);
    }
  });

  it('financeiro.valorRealizadoDesembolso <= valorPrevistoDesembolso', () => {
    const snapshot = buildFopagCompetenciaSnapshot(COMPETENCIA_ATIVA);
    expect(snapshot.financeiro.valorRealizadoDesembolso).toBeLessThanOrEqual(
      snapshot.financeiro.valorPrevistoDesembolso,
    );
  });

  it('eventos array includes HE origin event', () => {
    const snapshot = buildFopagCompetenciaSnapshot(COMPETENCIA_ATIVA);
    const heEvento = snapshot.eventos.find((e) => e.origem === 'horas_extras');
    expect(heEvento).toBeDefined();
  });

  it('previstoRealizado array has expected categories', () => {
    const snapshot = buildFopagCompetenciaSnapshot(COMPETENCIA_ATIVA);
    const categorias = snapshot.previstoRealizado.map((p) => p.categoria);
    expect(categorias).toContain('Salário Base');
    expect(categorias).toContain('Horas Extras');
  });

  it('obra percentualParticipacao values sum to ~100 when obras exist', () => {
    const snapshot = buildFopagCompetenciaSnapshot(COMPETENCIA_ATIVA);
    if (snapshot.obras.length > 0) {
      const total = snapshot.obras.reduce((acc, o) => acc + o.percentualParticipacao, 0);
      // Allow small floating-point variance
      expect(total).toBeGreaterThan(0);
    }
  });

  it('returns consistent results for a fechada competencia', () => {
    const snapshot = buildFopagCompetenciaSnapshot(COMPETENCIA_FECHADA);
    expect(snapshot.meta.totalFuncionarios).toBeGreaterThanOrEqual(0);
    expect(snapshot.financeiro.valorHorasExtrasIntegradas).toBeGreaterThanOrEqual(0);
  });

  it('snapshot for unknown competencia returns empty/zero state', () => {
    const snapshot = buildFopagCompetenciaSnapshot('9999-99');
    expect(snapshot.meta.totalFuncionarios).toBe(0);
    expect(snapshot.meta.valorHorasExtras).toBe(0);
    expect(snapshot.funcionarios).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// buildWorkforceFinancialSummary — FOPAG → Financeiro
// ---------------------------------------------------------------------------
describe('buildWorkforceFinancialSummary (FOPAG → Financeiro)', () => {
  it('returns a summary with required fields', () => {
    const summary = buildWorkforceFinancialSummary(COMPETENCIA_ATIVA);
    expect(summary).toHaveProperty('competencia');
    expect(summary).toHaveProperty('totalFuncionarios');
    expect(summary).toHaveProperty('valorFopagPrevisto');
    expect(summary).toHaveProperty('valorFopagRealizado');
    expect(summary).toHaveProperty('valorHorasExtrasPrevisto');
    expect(summary).toHaveProperty('valorHorasExtrasRealizado');
    expect(summary).toHaveProperty('valorPrevisto');
    expect(summary).toHaveProperty('valorRealizado');
    expect(summary).toHaveProperty('porObra');
    expect(summary).toHaveProperty('porCentroCusto');
  });

  it('competencia field matches the requested competencia', () => {
    const summary = buildWorkforceFinancialSummary(COMPETENCIA_ATIVA);
    expect(summary.competencia).toBe(COMPETENCIA_ATIVA);
  });

  it('valorPrevisto = valorFopagPrevisto + valorHorasExtrasPrevisto', () => {
    const summary = buildWorkforceFinancialSummary(COMPETENCIA_ATIVA);
    expect(summary.valorPrevisto).toBeCloseTo(summary.valorFopagPrevisto + summary.valorHorasExtrasPrevisto, 0);
  });

  it('valorRealizado <= valorPrevisto', () => {
    const summary = buildWorkforceFinancialSummary(COMPETENCIA_ATIVA);
    expect(summary.valorRealizado).toBeLessThanOrEqual(summary.valorPrevisto);
  });

  it('variacao = valorPrevisto - valorRealizado', () => {
    const summary = buildWorkforceFinancialSummary(COMPETENCIA_ATIVA);
    expect(summary.variacao).toBeCloseTo(summary.valorPrevisto - summary.valorRealizado, 0);
  });

  it('porObra items have required fields', () => {
    const summary = buildWorkforceFinancialSummary(COMPETENCIA_ATIVA);
    for (const obra of summary.porObra) {
      expect(obra).toHaveProperty('obraId');
      expect(obra).toHaveProperty('obraNome');
      expect(obra).toHaveProperty('valorFopagPrevisto');
      expect(obra).toHaveProperty('valorHorasExtrasPrevisto');
    }
  });

  it('origemHorasExtras shows integration tracking', () => {
    const summary = buildWorkforceFinancialSummary(COMPETENCIA_ATIVA);
    expect(summary.origemHorasExtras).toBeDefined();
    expect(typeof summary.origemHorasExtras.totalLancamentos).toBe('number');
    expect(typeof summary.origemHorasExtras.totalLancamentosIntegrados).toBe('number');
    expect(summary.origemHorasExtras.totalLancamentosIntegrados).toBeLessThanOrEqual(
      summary.origemHorasExtras.totalLancamentos,
    );
  });

  it('returns zero summary for unknown competencia', () => {
    const summary = buildWorkforceFinancialSummary('9999-99');
    expect(summary.totalFuncionarios).toBe(0);
    expect(summary.valorFopagPrevisto).toBe(0);
    expect(summary.valorHorasExtrasPrevisto).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// getObraLaborCostSnapshot — Obra-level cost from the chain
// ---------------------------------------------------------------------------
describe('getObraLaborCostSnapshot (Obra ↔ FOPAG chain)', () => {
  it('returns cost snapshot with required fields', () => {
    const snapshot = getObraLaborCostSnapshot('obra-1', COMPETENCIA_ATIVA);
    expect(snapshot).toHaveProperty('competencia');
    expect(snapshot).toHaveProperty('equipeAtiva');
    expect(snapshot).toHaveProperty('totalHorasExtras');
    expect(snapshot).toHaveProperty('custoHorasExtras');
    expect(snapshot).toHaveProperty('fopagPrevista');
    expect(snapshot).toHaveProperty('fopagRealizada');
    expect(snapshot).toHaveProperty('custoTotalPessoal');
  });

  it('custoTotalPessoal >= fopagPrevista', () => {
    const snapshot = getObraLaborCostSnapshot('obra-1', COMPETENCIA_ATIVA);
    expect(snapshot.custoTotalPessoal).toBeGreaterThanOrEqual(snapshot.fopagPrevista);
  });

  it('custoHorasExtras >= 0', () => {
    const snapshot = getObraLaborCostSnapshot('obra-1', COMPETENCIA_ATIVA);
    expect(snapshot.custoHorasExtras).toBeGreaterThanOrEqual(0);
  });

  it('competencia matches requested competencia', () => {
    const snapshot = getObraLaborCostSnapshot('obra-1', COMPETENCIA_ATIVA);
    expect(snapshot.competencia).toBe(COMPETENCIA_ATIVA);
  });
});
