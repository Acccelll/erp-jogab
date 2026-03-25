import { describe, it, expect } from 'vitest';
import {
  fetchContextOptionsMock,
  fetchContextBootstrapMock,
  normalizeContextOptions,
  normalizeContextBootstrap,
  mergeContextWithBootstrap,
  CONTEXT_API_ENDPOINTS,
} from '@/shared/lib/context.service';
import type { ContextoGlobal, ContextBootstrapData, Usuario } from '@/shared/types';

const mockUsuario: Usuario = {
  id: 'usr-admin-1',
  nome: 'Administrador JOGAB',
  email: 'admin@jogab.com.br',
  papel: 'admin',
  permissoes: ['dashboard:read'],
  empresaId: 'emp-1',
  filialId: 'fil-1',
};

// ---------------------------------------------------------------------------
// CONTEXT_API_ENDPOINTS
// ---------------------------------------------------------------------------
describe('CONTEXT_API_ENDPOINTS', () => {
  it('defines bootstrap and options paths', () => {
    expect(CONTEXT_API_ENDPOINTS.bootstrap).toBe('/context/bootstrap');
    expect(CONTEXT_API_ENDPOINTS.options).toBe('/context/options');
  });
});

// ---------------------------------------------------------------------------
// fetchContextOptionsMock
// ---------------------------------------------------------------------------
describe('fetchContextOptionsMock', () => {
  it('returns a complete ContextOptionsResponse', async () => {
    const options = await fetchContextOptionsMock();
    expect(Array.isArray(options.empresas)).toBe(true);
    expect(options.empresas.length).toBeGreaterThan(0);
    expect(Array.isArray(options.filiais)).toBe(true);
    expect(options.filiais.length).toBeGreaterThan(0);
    expect(Array.isArray(options.obras)).toBe(true);
    expect(options.obras.length).toBeGreaterThan(0);
    expect(Array.isArray(options.centrosCusto)).toBe(true);
    expect(Array.isArray(options.competencias)).toBe(true);
    expect(options.competencias.length).toBeGreaterThan(0);
  });

  it('each empresa has value and label', async () => {
    const options = await fetchContextOptionsMock();
    for (const e of options.empresas) {
      expect(e.value).toBeTruthy();
      expect(e.label).toBeTruthy();
    }
  });
});

// ---------------------------------------------------------------------------
// fetchContextBootstrapMock
// ---------------------------------------------------------------------------
describe('fetchContextBootstrapMock', () => {
  it('returns bootstrap data with contexto and options', async () => {
    const bootstrap = await fetchContextBootstrapMock(mockUsuario);
    expect(bootstrap.options).toBeDefined();
    expect(bootstrap.contexto).toBeDefined();
    expect(bootstrap.contexto.empresaId).toBe('emp-1');
    expect(bootstrap.contexto.filialId).toBeTruthy();
    expect(bootstrap.contexto.competencia).toBeTruthy();
  });

  it('sets obraId and centroCustoId based on filial', async () => {
    const bootstrap = await fetchContextBootstrapMock(mockUsuario);
    expect(bootstrap.contexto.obraId).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// normalizeContextOptions
// ---------------------------------------------------------------------------
describe('normalizeContextOptions', () => {
  it('returns safe defaults for null input', () => {
    const result = normalizeContextOptions(null);
    expect(result.empresas).toEqual([]);
    expect(result.filiais).toEqual([]);
    expect(result.obras).toEqual([]);
    expect(result.centrosCusto).toEqual([]);
    expect(result.competencias).toEqual([]);
  });

  it('returns safe defaults for undefined input', () => {
    const result = normalizeContextOptions(undefined);
    expect(result.empresas).toEqual([]);
    expect(result.competencias).toEqual([]);
  });

  it('returns safe defaults for partial input', () => {
    const result = normalizeContextOptions({ empresas: [{ value: 'e1', label: 'E1' }] });
    expect(result.empresas).toHaveLength(1);
    expect(result.filiais).toEqual([]);
    expect(result.obras).toEqual([]);
  });

  it('preserves valid arrays', () => {
    const input = {
      empresas: [{ value: 'e1', label: 'E1' }],
      filiais: [{ value: 'f1', label: 'F1' }],
      obras: [{ value: 'o1', label: 'O1' }],
      centrosCusto: [{ value: 'c1', label: 'C1' }],
      competencias: [{ value: '2026-03', label: '03/2026' }],
    };
    const result = normalizeContextOptions(input);
    expect(result).toEqual(input);
  });

  it('returns empty arrays when given non-array values', () => {
    const result = normalizeContextOptions({
      empresas: 'not-an-array' as unknown as [],
      filiais: 42 as unknown as [],
    });
    expect(result.empresas).toEqual([]);
    expect(result.filiais).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// normalizeContextBootstrap
// ---------------------------------------------------------------------------
describe('normalizeContextBootstrap', () => {
  it('returns safe defaults for null input', () => {
    const result = normalizeContextBootstrap(null);
    expect(result.options.empresas).toEqual([]);
    expect(result.contexto.empresaId).toBeNull();
    expect(result.contexto.filialId).toBeNull();
    expect(result.contexto.obraId).toBeNull();
    expect(result.contexto.competencia).toBeNull();
  });

  it('returns safe defaults for undefined input', () => {
    const result = normalizeContextBootstrap(undefined);
    expect(result.options.filiais).toEqual([]);
    expect(result.contexto.centroCustoId).toBeNull();
  });

  it('preserves valid partial contexto', () => {
    const result = normalizeContextBootstrap({
      contexto: { empresaId: 'emp-1', filialId: 'fil-1' } as ContextoGlobal,
    });
    expect(result.contexto.empresaId).toBe('emp-1');
    expect(result.contexto.filialId).toBe('fil-1');
    expect(result.contexto.obraId).toBeNull();
  });

  it('preserves valid options', () => {
    const result = normalizeContextBootstrap({
      options: {
        empresas: [{ value: 'e1', label: 'E1' }],
        filiais: [],
        obras: [],
        centrosCusto: [],
        competencias: [],
      },
    });
    expect(result.options.empresas).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// mergeContextWithBootstrap
// ---------------------------------------------------------------------------
describe('mergeContextWithBootstrap', () => {
  const emptyContext: ContextoGlobal = {
    empresaId: null,
    filialId: null,
    obraId: null,
    competencia: null,
    periodoInicio: null,
    periodoFim: null,
    centroCustoId: null,
  };

  const bootstrapData: ContextBootstrapData = {
    options: {
      empresas: [],
      filiais: [],
      obras: [],
      centrosCusto: [],
      competencias: [],
    },
    contexto: {
      empresaId: 'emp-1',
      filialId: 'fil-1',
      obraId: 'obra-1',
      competencia: '2026-03',
      periodoInicio: null,
      periodoFim: null,
      centroCustoId: 'cc-1',
    },
  };

  it('uses bootstrap values when current context is empty', () => {
    const merged = mergeContextWithBootstrap(emptyContext, bootstrapData);
    expect(merged.empresaId).toBe('emp-1');
    expect(merged.filialId).toBe('fil-1');
    expect(merged.obraId).toBe('obra-1');
    expect(merged.competencia).toBe('2026-03');
    expect(merged.centroCustoId).toBe('cc-1');
  });

  it('preserves current context values when already set', () => {
    const currentContext: ContextoGlobal = {
      empresaId: 'emp-2',
      filialId: 'fil-3',
      obraId: null,
      competencia: '2026-02',
      periodoInicio: null,
      periodoFim: null,
      centroCustoId: null,
    };
    const merged = mergeContextWithBootstrap(currentContext, bootstrapData);
    expect(merged.empresaId).toBe('emp-2');
    expect(merged.filialId).toBe('fil-3');
    expect(merged.obraId).toBe('obra-1');
    expect(merged.competencia).toBe('2026-02');
    expect(merged.centroCustoId).toBe('cc-1');
  });
});
