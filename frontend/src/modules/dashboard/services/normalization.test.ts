import { describe, it, expect } from 'vitest';
import { normalizeHorasExtrasDashboardData } from '@/modules/horas-extras/services/horasExtras.service';
import { normalizeHorasExtrasAprovacaoData } from '@/modules/horas-extras/services/horasExtrasAprovacao.service';
import { normalizeComprasDashboardData } from '@/modules/compras/services/compras.service';
import {
  normalizeAdminDashboardData,
  normalizeAdminUsuarios,
  normalizeAdminPerfis,
  normalizeAdminPermissoes,
  normalizeAdminParametros,
  normalizeAdminLogs,
  normalizeAdminIntegracoes,
} from '@/modules/admin/services/admin.service';
import { normalizeDashboardSummary } from '@/modules/dashboard/services/dashboard.service';
import { normalizeFuncionariosListResponse } from '@/modules/rh/services/funcionarios.service';
import { normalizeFopagCompetenciasResponse } from '@/modules/fopag/services/fopag.service';
import { normalizeRelatoriosDashboardData } from '@/modules/relatorios/services/relatorios.service';
import { normalizeObrasListResponse } from '@/modules/obras/services/obras.service';
import { normalizeRelatorioCategoriaData } from '@/modules/relatorios/services/relatorios.service';
import { normalizeFinanceiroDashboardData } from '@/modules/financeiro/services/financeiro.service';
import { normalizeFiscalDashboardData } from '@/modules/fiscal/services/fiscal.service';
import { normalizeEstoqueDashboardData } from '@/modules/estoque/services/estoque.service';
import { normalizeMedicoesDashboardData } from '@/modules/medicoes/services/medicoes.service';
import { normalizeDocumentosDashboardData } from '@/modules/documentos/services/documentos.service';

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
      kpis: {
        totalLancamentos: 5,
        pendentesAprovacao: 2,
        aprovadas: 0,
        fechadasParaFopag: 0,
        horasTotais: 10,
        valorTotal: 1000,
      },
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
      kpis: {
        totalSolicitacoes: 10,
        solicitacoesPendentes: 3,
        cotacoesEmAberto: 2,
        pedidosEmitidos: 5,
        valorComprometido: 50000,
        valorAguardandoFiscal: 10000,
      },
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
      resumo: {
        totalUsuarios: 5,
        totalPerfis: 2,
        totalPermissoes: 10,
        parametrosAtivos: 3,
        logsRecentes: 100,
        integracoesAtivas: 1,
      },
    });
    expect(result.resumo.totalUsuarios).toBe(5);
    expect(result.categorias).toEqual([]);
    expect(result.usuarios).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// RH (Funcionários) list normalization
// ---------------------------------------------------------------------------
describe('normalizeFuncionariosListResponse', () => {
  it('returns safe defaults for null payload', () => {
    const result = normalizeFuncionariosListResponse(null);
    expect(result.data).toEqual([]);
    expect(result.kpis.totalFuncionarios).toBe(0);
    expect(result.kpis.ativos).toBe(0);
    expect(result.kpis.afastados).toBe(0);
    expect(result.kpis.ferias).toBe(0);
    expect(result.kpis.desligados).toBe(0);
    expect(result.kpis.custoFolhaEstimado).toBe(0);
    expect(result.total).toBe(0);
  });

  it('returns safe defaults for undefined payload', () => {
    const result = normalizeFuncionariosListResponse(undefined);
    expect(result.data).toEqual([]);
    expect(result.kpis.totalFuncionarios).toBe(0);
    expect(result.total).toBe(0);
  });

  it('returns safe defaults for empty object payload', () => {
    const result = normalizeFuncionariosListResponse({});
    expect(result.data).toEqual([]);
    expect(result.kpis.ativos).toBe(0);
  });

  it('preserves existing data in partial payload', () => {
    const result = normalizeFuncionariosListResponse({
      kpis: { totalFuncionarios: 10, ativos: 8, afastados: 1, ferias: 1, desligados: 0, custoFolhaEstimado: 50000 },
      total: 10,
    });
    expect(result.kpis.totalFuncionarios).toBe(10);
    expect(result.kpis.ativos).toBe(8);
    expect(result.data).toEqual([]);
    expect(result.total).toBe(10);
  });
});

// ---------------------------------------------------------------------------
// FOPAG competências normalization
// ---------------------------------------------------------------------------
describe('normalizeFopagCompetenciasResponse', () => {
  it('returns safe defaults for null payload', () => {
    const result = normalizeFopagCompetenciasResponse(null);
    expect(result.data).toEqual([]);
    expect(result.kpis.totalCompetencias).toBe(0);
    expect(result.kpis.emConsolidacao).toBe(0);
    expect(result.kpis.prontasParaRateio).toBe(0);
    expect(result.kpis.valorPrevistoTotal).toBe(0);
    expect(result.kpis.valorRealizadoTotal).toBe(0);
  });

  it('returns safe defaults for undefined payload', () => {
    const result = normalizeFopagCompetenciasResponse(undefined);
    expect(result.data).toEqual([]);
    expect(result.kpis.totalCompetencias).toBe(0);
  });

  it('returns safe defaults for empty object payload', () => {
    const result = normalizeFopagCompetenciasResponse({});
    expect(result.data).toEqual([]);
    expect(result.kpis.emConsolidacao).toBe(0);
  });

  it('preserves existing data in partial payload', () => {
    const result = normalizeFopagCompetenciasResponse({
      kpis: {
        totalCompetencias: 6,
        emConsolidacao: 2,
        prontasParaRateio: 1,
        valorPrevistoTotal: 300000,
        valorRealizadoTotal: 250000,
      },
    });
    expect(result.kpis.totalCompetencias).toBe(6);
    expect(result.kpis.valorPrevistoTotal).toBe(300000);
    expect(result.data).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Relatórios dashboard normalization
// ---------------------------------------------------------------------------
describe('normalizeRelatoriosDashboardData', () => {
  it('returns safe defaults for null payload', () => {
    const result = normalizeRelatoriosDashboardData(null);
    expect(result.itens).toEqual([]);
    expect(result.categorias).toEqual([]);
    expect(result.resumo.totalRelatorios).toBe(0);
    expect(result.resumo.categoriasAtivas).toBe(0);
    expect(result.resumo.disponiveis).toBe(0);
    expect(result.resumo.planejados).toBe(0);
    expect(result.resumo.exportaveis).toBe(0);
    expect(result.resumoCards).toEqual([]);
    expect(result.saidasOperacionais).toEqual([]);
    expect(result.coberturaModulos).toEqual([]);
  });

  it('returns safe defaults for undefined payload', () => {
    const result = normalizeRelatoriosDashboardData(undefined);
    expect(result.itens).toEqual([]);
    expect(result.resumo.totalRelatorios).toBe(0);
  });

  it('returns safe defaults for empty object payload', () => {
    const result = normalizeRelatoriosDashboardData({});
    expect(result.itens).toEqual([]);
    expect(result.saidasOperacionais).toEqual([]);
  });

  it('preserves existing data in partial payload', () => {
    const result = normalizeRelatoriosDashboardData({
      resumo: { totalRelatorios: 15, categoriasAtivas: 5, disponiveis: 10, planejados: 5, exportaveis: 8 },
    });
    expect(result.resumo.totalRelatorios).toBe(15);
    expect(result.itens).toEqual([]);
    expect(result.coberturaModulos).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Obras list normalization
// ---------------------------------------------------------------------------
describe('normalizeObrasListResponse', () => {
  it('returns safe defaults for null payload', () => {
    const result = normalizeObrasListResponse(null);
    expect(result.data).toEqual([]);
    expect(result.kpis.totalObras).toBe(0);
    expect(result.kpis.obrasAtivas).toBe(0);
    expect(result.kpis.obrasConcluidas).toBe(0);
    expect(result.kpis.obrasParalisadas).toBe(0);
    expect(result.kpis.orcamentoTotal).toBe(0);
    expect(result.kpis.custoRealizadoTotal).toBe(0);
    expect(result.total).toBe(0);
  });

  it('returns safe defaults for undefined payload', () => {
    const result = normalizeObrasListResponse(undefined);
    expect(result.data).toEqual([]);
    expect(result.kpis.totalObras).toBe(0);
    expect(result.total).toBe(0);
  });

  it('returns safe defaults for empty object payload', () => {
    const result = normalizeObrasListResponse({});
    expect(result.data).toEqual([]);
    expect(result.kpis.obrasAtivas).toBe(0);
  });

  it('preserves existing data in partial payload', () => {
    const result = normalizeObrasListResponse({
      kpis: {
        totalObras: 8,
        obrasAtivas: 5,
        obrasConcluidas: 2,
        obrasParalisadas: 1,
        orcamentoTotal: 1000000,
        custoRealizadoTotal: 500000,
      },
      total: 8,
    });
    expect(result.kpis.totalObras).toBe(8);
    expect(result.kpis.obrasAtivas).toBe(5);
    expect(result.data).toEqual([]);
    expect(result.total).toBe(8);
  });
});

// ---------------------------------------------------------------------------
// Admin list normalizers
// ---------------------------------------------------------------------------
describe('normalizeAdminUsuarios', () => {
  it('returns [] for null', () => {
    expect(normalizeAdminUsuarios(null)).toEqual([]);
  });
  it('returns [] for undefined', () => {
    expect(normalizeAdminUsuarios(undefined)).toEqual([]);
  });
  it('returns [] for non-array payload', () => {
    expect(normalizeAdminUsuarios({ foo: 'bar' })).toEqual([]);
    expect(normalizeAdminUsuarios('string')).toEqual([]);
    expect(normalizeAdminUsuarios(42)).toEqual([]);
  });
  it('preserves valid array', () => {
    const arr = [{ id: '1', nome: 'Admin' }];
    expect(normalizeAdminUsuarios(arr)).toBe(arr);
  });
});

describe('normalizeAdminPerfis', () => {
  it('returns [] for null', () => {
    expect(normalizeAdminPerfis(null)).toEqual([]);
  });
  it('returns [] for undefined', () => {
    expect(normalizeAdminPerfis(undefined)).toEqual([]);
  });
  it('returns [] for non-array payload', () => {
    expect(normalizeAdminPerfis({ foo: 'bar' })).toEqual([]);
  });
  it('preserves valid array', () => {
    const arr = [{ id: '1', nome: 'Gestor' }];
    expect(normalizeAdminPerfis(arr)).toBe(arr);
  });
});

describe('normalizeAdminPermissoes', () => {
  it('returns [] for null', () => {
    expect(normalizeAdminPermissoes(null)).toEqual([]);
  });
  it('returns [] for undefined', () => {
    expect(normalizeAdminPermissoes(undefined)).toEqual([]);
  });
  it('returns [] for non-array payload', () => {
    expect(normalizeAdminPermissoes('bad')).toEqual([]);
  });
  it('preserves valid array', () => {
    const arr = [{ id: '1', modulo: 'admin' }];
    expect(normalizeAdminPermissoes(arr)).toBe(arr);
  });
});

describe('normalizeAdminParametros', () => {
  it('returns [] for null', () => {
    expect(normalizeAdminParametros(null)).toEqual([]);
  });
  it('returns [] for undefined', () => {
    expect(normalizeAdminParametros(undefined)).toEqual([]);
  });
  it('returns [] for non-array payload', () => {
    expect(normalizeAdminParametros(123)).toEqual([]);
  });
  it('preserves valid array', () => {
    const arr = [{ id: '1', chave: 'PARAM' }];
    expect(normalizeAdminParametros(arr)).toBe(arr);
  });
});

describe('normalizeAdminLogs', () => {
  it('returns [] for null', () => {
    expect(normalizeAdminLogs(null)).toEqual([]);
  });
  it('returns [] for undefined', () => {
    expect(normalizeAdminLogs(undefined)).toEqual([]);
  });
  it('returns [] for non-array payload', () => {
    expect(normalizeAdminLogs({ logs: [] })).toEqual([]);
  });
  it('preserves valid array', () => {
    const arr = [{ id: '1', acao: 'login' }];
    expect(normalizeAdminLogs(arr)).toBe(arr);
  });
});

describe('normalizeAdminIntegracoes', () => {
  it('returns [] for null', () => {
    expect(normalizeAdminIntegracoes(null)).toEqual([]);
  });
  it('returns [] for undefined', () => {
    expect(normalizeAdminIntegracoes(undefined)).toEqual([]);
  });
  it('returns [] for non-array payload', () => {
    expect(normalizeAdminIntegracoes(true)).toEqual([]);
  });
  it('preserves valid array', () => {
    const arr = [{ id: '1', nome: 'SAP' }];
    expect(normalizeAdminIntegracoes(arr)).toBe(arr);
  });
});

// ---------------------------------------------------------------------------
// Relatórios categoria normalization (was previously untested)
// ---------------------------------------------------------------------------
describe('normalizeRelatorioCategoriaData', () => {
  it('returns safe defaults for null payload', () => {
    const result = normalizeRelatorioCategoriaData(null, 'obra');
    expect(result.categoria).toBe('obra');
    expect(result.itens).toEqual([]);
    expect(result.resumoCards).toEqual([]);
    expect(result.saidasOperacionais).toEqual([]);
    expect(result.coberturaModulos).toEqual([]);
  });

  it('returns safe defaults for undefined payload', () => {
    const result = normalizeRelatorioCategoriaData(undefined, 'financeiro');
    expect(result.categoria).toBe('financeiro');
    expect(result.itens).toEqual([]);
  });

  it('returns safe defaults for empty object payload', () => {
    const result = normalizeRelatorioCategoriaData({}, 'rh');
    expect(result.categoria).toBe('rh');
    expect(result.itens).toEqual([]);
  });

  it('preserves existing data in partial payload', () => {
    const result = normalizeRelatorioCategoriaData(
      {
        categoria: 'obra',
        itens: [
          {
            id: '1',
            titulo: 'Rel',
            descricao: '',
            categoria: 'obra',
            modulo: 'obras',
            tipo: 'listagem',
            formato: 'pdf',
            disponivel: true,
          },
        ],
      },
      'obra',
    );
    expect(result.itens).toHaveLength(1);
    expect(result.resumoCards).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Financeiro dashboard normalization
// ---------------------------------------------------------------------------
describe('normalizeFinanceiroDashboardData', () => {
  it('returns safe defaults for null payload', () => {
    const result = normalizeFinanceiroDashboardData(null);
    expect(result.titulos).toEqual([]);
    expect(result.kpis.totalTitulos).toBe(0);
    expect(result.kpis.totalPagar).toBe(0);
    expect(result.kpis.totalReceber).toBe(0);
    expect(result.kpis.valorPagar).toBe(0);
    expect(result.kpis.valorReceber).toBe(0);
    expect(result.kpis.valorVencido).toBe(0);
    expect(result.kpis.saldoProjetado).toBe(0);
    expect(result.resumoCards).toEqual([]);
    expect(result.statusResumo).toEqual([]);
    expect(result.tipoResumo).toEqual([]);
    expect(result.pessoal.porObra).toEqual([]);
    expect(result.pessoal.porCentroCusto).toEqual([]);
    expect(result.pessoal.previstoRealizado).toEqual([]);
    expect(result.pessoal.destaques).toEqual([]);
  });

  it('returns safe defaults for undefined payload', () => {
    const result = normalizeFinanceiroDashboardData(undefined);
    expect(result.titulos).toEqual([]);
    expect(result.kpis.totalTitulos).toBe(0);
  });

  it('returns safe defaults for empty object payload', () => {
    const result = normalizeFinanceiroDashboardData({});
    expect(result.titulos).toEqual([]);
    expect(result.resumoCards).toEqual([]);
  });

  it('preserves existing data in partial payload', () => {
    const result = normalizeFinanceiroDashboardData({
      kpis: {
        totalTitulos: 20,
        totalPagar: 10,
        totalReceber: 10,
        valorPagar: 50000,
        valorReceber: 60000,
        valorVencido: 5000,
        saldoProjetado: 10000,
      },
    });
    expect(result.kpis.totalTitulos).toBe(20);
    expect(result.kpis.valorPagar).toBe(50000);
    expect(result.titulos).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Fiscal dashboard normalization
// ---------------------------------------------------------------------------
describe('normalizeFiscalDashboardData', () => {
  it('returns safe defaults for null payload', () => {
    const result = normalizeFiscalDashboardData(null);
    expect(result.documentos).toEqual([]);
    expect(result.kpis.totalDocumentos).toBe(0);
    expect(result.kpis.totalEntradas).toBe(0);
    expect(result.kpis.totalSaidas).toBe(0);
    expect(result.kpis.valorEntradas).toBe(0);
    expect(result.kpis.valorSaidas).toBe(0);
    expect(result.kpis.validando).toBe(0);
    expect(result.kpis.comErro).toBe(0);
    expect(result.resumoCards).toEqual([]);
    expect(result.statusResumo).toEqual([]);
  });

  it('returns safe defaults for undefined payload', () => {
    const result = normalizeFiscalDashboardData(undefined);
    expect(result.documentos).toEqual([]);
    expect(result.kpis.totalDocumentos).toBe(0);
  });

  it('returns safe defaults for empty object payload', () => {
    const result = normalizeFiscalDashboardData({});
    expect(result.documentos).toEqual([]);
    expect(result.resumoCards).toEqual([]);
  });

  it('preserves existing data in partial payload', () => {
    const result = normalizeFiscalDashboardData({
      kpis: {
        totalDocumentos: 30,
        totalEntradas: 18,
        totalSaidas: 12,
        valorEntradas: 100000,
        valorSaidas: 80000,
        validando: 2,
        comErro: 1,
      },
    });
    expect(result.kpis.totalDocumentos).toBe(30);
    expect(result.kpis.valorEntradas).toBe(100000);
    expect(result.documentos).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Estoque dashboard normalization
// ---------------------------------------------------------------------------
describe('normalizeEstoqueDashboardData', () => {
  it('returns safe defaults for null payload', () => {
    const result = normalizeEstoqueDashboardData(null);
    expect(result.itens).toEqual([]);
    expect(result.movimentacoes).toEqual([]);
    expect(result.kpis.totalItens).toBe(0);
    expect(result.kpis.itensCriticos).toBe(0);
    expect(result.kpis.locaisAtivos).toBe(0);
    expect(result.kpis.valorEstocado).toBe(0);
    expect(result.kpis.valorReservado).toBe(0);
    expect(result.kpis.consumoMensal).toBe(0);
    expect(result.kpis.entradasPendentes).toBe(0);
    expect(result.resumoCards).toEqual([]);
    expect(result.statusResumo).toEqual([]);
    expect(result.localResumo).toEqual([]);
    expect(result.tipoResumo).toEqual([]);
  });

  it('returns safe defaults for undefined payload', () => {
    const result = normalizeEstoqueDashboardData(undefined);
    expect(result.itens).toEqual([]);
    expect(result.kpis.totalItens).toBe(0);
  });

  it('returns safe defaults for empty object payload', () => {
    const result = normalizeEstoqueDashboardData({});
    expect(result.itens).toEqual([]);
    expect(result.movimentacoes).toEqual([]);
    expect(result.localResumo).toEqual([]);
  });

  it('preserves existing data in partial payload', () => {
    const result = normalizeEstoqueDashboardData({
      kpis: {
        totalItens: 50,
        itensCriticos: 3,
        locaisAtivos: 4,
        valorEstocado: 200000,
        valorReservado: 30000,
        consumoMensal: 15000,
        entradasPendentes: 5,
      },
    });
    expect(result.kpis.totalItens).toBe(50);
    expect(result.kpis.valorEstocado).toBe(200000);
    expect(result.itens).toEqual([]);
    expect(result.tipoResumo).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Medições dashboard normalization
// ---------------------------------------------------------------------------
describe('normalizeMedicoesDashboardData', () => {
  it('returns safe defaults for null payload', () => {
    const result = normalizeMedicoesDashboardData(null);
    expect(result.medicoes).toEqual([]);
    expect(result.kpis.totalMedicoes).toBe(0);
    expect(result.kpis.medicoesEmAprovacao).toBe(0);
    expect(result.kpis.medicoesAprovadas).toBe(0);
    expect(result.kpis.valorMedido).toBe(0);
    expect(result.kpis.valorFaturado).toBe(0);
    expect(result.kpis.valorReceber).toBe(0);
    expect(result.resumoCards).toEqual([]);
    expect(result.statusResumo).toEqual([]);
    expect(result.competenciaResumo).toEqual([]);
  });

  it('returns safe defaults for undefined payload', () => {
    const result = normalizeMedicoesDashboardData(undefined);
    expect(result.medicoes).toEqual([]);
    expect(result.kpis.totalMedicoes).toBe(0);
  });

  it('returns safe defaults for empty object payload', () => {
    const result = normalizeMedicoesDashboardData({});
    expect(result.medicoes).toEqual([]);
    expect(result.competenciaResumo).toEqual([]);
  });

  it('preserves existing data in partial payload', () => {
    const result = normalizeMedicoesDashboardData({
      kpis: {
        totalMedicoes: 15,
        medicoesEmAprovacao: 4,
        medicoesAprovadas: 8,
        valorMedido: 500000,
        valorFaturado: 350000,
        valorReceber: 150000,
      },
    });
    expect(result.kpis.totalMedicoes).toBe(15);
    expect(result.kpis.valorMedido).toBe(500000);
    expect(result.medicoes).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Documentos dashboard normalization
// ---------------------------------------------------------------------------
describe('normalizeDocumentosDashboardData', () => {
  it('returns safe defaults for null payload', () => {
    const result = normalizeDocumentosDashboardData(null);
    expect(result.documentos).toEqual([]);
    expect(result.kpis.totalDocumentos).toBe(0);
    expect(result.kpis.vigentes).toBe(0);
    expect(result.kpis.aVencer).toBe(0);
    expect(result.kpis.vencidos).toBe(0);
    expect(result.kpis.entidadesCobertas).toBe(0);
    expect(result.kpis.alertasCriticos).toBe(0);
    expect(result.resumoCards).toEqual([]);
    expect(result.statusResumo).toEqual([]);
    expect(result.vencimentoResumo).toEqual([]);
  });

  it('returns safe defaults for undefined payload', () => {
    const result = normalizeDocumentosDashboardData(undefined);
    expect(result.documentos).toEqual([]);
    expect(result.kpis.totalDocumentos).toBe(0);
  });

  it('returns safe defaults for empty object payload', () => {
    const result = normalizeDocumentosDashboardData({});
    expect(result.documentos).toEqual([]);
    expect(result.vencimentoResumo).toEqual([]);
  });

  it('preserves existing data in partial payload', () => {
    const result = normalizeDocumentosDashboardData({
      kpis: {
        totalDocumentos: 40,
        vigentes: 30,
        aVencer: 5,
        vencidos: 5,
        entidadesCobertas: 15,
        alertasCriticos: 3,
      },
    });
    expect(result.kpis.totalDocumentos).toBe(40);
    expect(result.kpis.vigentes).toBe(30);
    expect(result.documentos).toEqual([]);
  });
});
