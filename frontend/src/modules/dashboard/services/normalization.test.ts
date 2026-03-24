import { describe, it, expect } from 'vitest';
import { normalizeHorasExtrasDashboardData } from '@/modules/horas-extras/services/horasExtras.service';
import { normalizeHorasExtrasAprovacaoData } from '@/modules/horas-extras/services/horasExtrasAprovacao.service';
import { normalizeComprasDashboardData } from '@/modules/compras/services/compras.service';
import { normalizeAdminDashboardData } from '@/modules/admin/services/admin.service';
import { normalizeDashboardSummary } from '@/modules/dashboard/services/dashboard.service';

// ---------------------------------------------------------------------------
// Dashboard normalization
// ---------------------------------------------------------------------------
describe('normalizeDashboardSummary', () => {
  it('returns safe defaults for null payload', () => {
    const result = normalizeDashboardSummary(null);
    expect(result.kpis).toEqual([]);
    expect(result.obras).toEqual([]);
    expect(result.rh).toEqual([]);
    expect(result.financeiro).toEqual([]);
    expect(result.alertas).toEqual([]);
    expect(result.generatedAt).toBeTruthy();
  });

  it('returns safe defaults for undefined payload', () => {
    const result = normalizeDashboardSummary(undefined);
    expect(result.kpis).toEqual([]);
    expect(result.obras).toEqual([]);
  });

  it('preserves existing data in partial payload', () => {
    const result = normalizeDashboardSummary({
      kpis: [{ label: 'Test', value: 1 }],
    });
    expect(result.kpis).toHaveLength(1);
    expect(result.obras).toEqual([]);
    expect(result.alertas).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Horas-extras dashboard normalization
// ---------------------------------------------------------------------------
describe('normalizeHorasExtrasDashboardData', () => {
  it('returns safe defaults for null payload', () => {
    const result = normalizeHorasExtrasDashboardData(null);
    expect(result.list).toEqual([]);
    expect(result.kpis.totalLancamentos).toBe(0);
    expect(result.kpis.pendentesAprovacao).toBe(0);
    expect(result.kpis.horasTotais).toBe(0);
    expect(result.kpis.valorTotal).toBe(0);
    expect(result.resumoCards).toEqual([]);
    expect(result.fechamentoAtual).toBeNull();
  });

  it('returns safe defaults for undefined payload', () => {
    const result = normalizeHorasExtrasDashboardData(undefined);
    expect(result.list).toEqual([]);
    expect(result.resumoCards).toEqual([]);
  });

  it('returns safe defaults for empty object payload', () => {
    const result = normalizeHorasExtrasDashboardData({});
    expect(result.list).toEqual([]);
    expect(result.kpis.totalLancamentos).toBe(0);
  });

  it('preserves existing data in partial payload', () => {
    const result = normalizeHorasExtrasDashboardData({
      kpis: { totalLancamentos: 5, pendentesAprovacao: 2, aprovadas: 0, fechadasParaFopag: 0, horasTotais: 10, valorTotal: 1000 },
    });
    expect(result.kpis.totalLancamentos).toBe(5);
    expect(result.list).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Horas-extras aprovação normalization
// ---------------------------------------------------------------------------
describe('normalizeHorasExtrasAprovacaoData', () => {
  it('returns safe defaults for null payload', () => {
    const result = normalizeHorasExtrasAprovacaoData(null);
    expect(result.kpis.pendentes).toBe(0);
    expect(result.kpis.emRisco).toBe(0);
    expect(result.kpis.valorPendente).toBe(0);
    expect(result.kpis.obrasImpactadas).toBe(0);
    expect(result.aprovacoes).toEqual([]);
    expect(result.historico).toEqual([]);
    expect(result.resumoCards).toEqual([]);
  });

  it('returns safe defaults for undefined payload', () => {
    const result = normalizeHorasExtrasAprovacaoData(undefined);
    expect(result.aprovacoes).toEqual([]);
  });

  it('preserves existing data in partial payload', () => {
    const result = normalizeHorasExtrasAprovacaoData({
      kpis: { pendentes: 3, emRisco: 1, valorPendente: 5000, obrasImpactadas: 2 },
    });
    expect(result.kpis.pendentes).toBe(3);
    expect(result.aprovacoes).toEqual([]);
    expect(result.historico).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Compras dashboard normalization
// ---------------------------------------------------------------------------
describe('normalizeComprasDashboardData', () => {
  it('returns safe defaults for null payload', () => {
    const result = normalizeComprasDashboardData(null);
    expect(result.solicitacoes).toEqual([]);
    expect(result.cotacoes).toEqual([]);
    expect(result.pedidos).toEqual([]);
    expect(result.kpis.totalSolicitacoes).toBe(0);
    expect(result.kpis.valorComprometido).toBe(0);
    expect(result.kpis.valorAguardandoFiscal).toBe(0);
    expect(result.resumoCards).toEqual([]);
    expect(result.statusResumo).toEqual([]);
  });

  it('returns safe defaults for undefined payload', () => {
    const result = normalizeComprasDashboardData(undefined);
    expect(result.solicitacoes).toEqual([]);
    expect(result.kpis.totalSolicitacoes).toBe(0);
  });

  it('preserves existing data in partial payload', () => {
    const result = normalizeComprasDashboardData({
      kpis: { totalSolicitacoes: 10, solicitacoesPendentes: 3, cotacoesEmAberto: 2, pedidosEmitidos: 5, valorComprometido: 50000, valorAguardandoFiscal: 10000 },
    });
    expect(result.kpis.totalSolicitacoes).toBe(10);
    expect(result.solicitacoes).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Admin dashboard normalization
// ---------------------------------------------------------------------------
describe('normalizeAdminDashboardData', () => {
  it('returns safe defaults for null payload', () => {
    const result = normalizeAdminDashboardData(null);
    expect(result.resumo.totalUsuarios).toBe(0);
    expect(result.resumo.totalPerfis).toBe(0);
    expect(result.categorias).toEqual([]);
    expect(result.usuarios).toEqual([]);
    expect(result.perfis).toEqual([]);
    expect(result.permissoes).toEqual([]);
    expect(result.parametros).toEqual([]);
    expect(result.logs).toEqual([]);
    expect(result.integracoes).toEqual([]);
  });

  it('returns safe defaults for undefined payload', () => {
    const result = normalizeAdminDashboardData(undefined);
    expect(result.categorias).toEqual([]);
    expect(result.resumo.totalUsuarios).toBe(0);
  });

  it('preserves existing data in partial payload', () => {
    const result = normalizeAdminDashboardData({
      resumo: { totalUsuarios: 5, totalPerfis: 2, totalPermissoes: 10, parametrosAtivos: 3, logsRecentes: 100, integracoesAtivas: 1 },
    });
    expect(result.resumo.totalUsuarios).toBe(5);
    expect(result.categorias).toEqual([]);
    expect(result.usuarios).toEqual([]);
  });
});
