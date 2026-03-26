import { describe, it, expect } from 'vitest';
import {
  getIntegrationConfig,
  getModuleReadiness,
  getReadyModules,
  getIntegratedModules,
  MODULE_READINESS,
} from '@/shared/lib/integration';

// ---------------------------------------------------------------------------
// getIntegrationConfig
// ---------------------------------------------------------------------------
describe('getIntegrationConfig', () => {
  it('returns default config when env vars are not set', () => {
    const config = getIntegrationConfig();
    expect(config).toEqual({
      apiBaseUrl: expect.any(String),
      fallbackEnabled: expect.any(Boolean),
      timeoutMs: expect.any(Number),
    });
    expect(config.timeoutMs).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// MODULE_READINESS registry
// ---------------------------------------------------------------------------
describe('MODULE_READINESS', () => {
  it('contains all 15 official modules (including auth and context)', () => {
    expect(MODULE_READINESS).toHaveLength(15);
    const moduleNames = MODULE_READINESS.map((m) => m.module);
    expect(moduleNames).toContain('auth');
    expect(moduleNames).toContain('context');
    expect(moduleNames).toContain('dashboard');
    expect(moduleNames).toContain('obras');
    expect(moduleNames).toContain('rh');
    expect(moduleNames).toContain('horas-extras');
    expect(moduleNames).toContain('fopag');
    expect(moduleNames).toContain('compras');
    expect(moduleNames).toContain('financeiro');
    expect(moduleNames).toContain('fiscal');
    expect(moduleNames).toContain('estoque');
    expect(moduleNames).toContain('medicoes');
    expect(moduleNames).toContain('documentos');
    expect(moduleNames).toContain('relatorios');
    expect(moduleNames).toContain('admin');
  });

  it('every module has at least one endpoint', () => {
    for (const mod of MODULE_READINESS) {
      expect(mod.endpoints.length).toBeGreaterThan(0);
    }
  });

  it('every endpoint has a valid path, method, readiness, integrated flag, and description', () => {
    const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    const validReadiness = ['ready', 'partial', 'mock-only'];

    for (const mod of MODULE_READINESS) {
      for (const ep of mod.endpoints) {
        expect(ep.path).toMatch(/^\//);
        expect(validMethods).toContain(ep.method);
        expect(validReadiness).toContain(ep.readiness);
        expect(typeof ep.integrated).toBe('boolean');
        expect(ep.description.length).toBeGreaterThan(0);
      }
    }
  });

  it('module status is consistent with endpoint readiness', () => {
    for (const mod of MODULE_READINESS) {
      const hasPartial = mod.endpoints.some((ep) => ep.readiness === 'partial' || ep.readiness === 'mock-only');
      if (mod.status === 'ready') {
        expect(hasPartial).toBe(false);
      }
    }
  });

  it('integrated modules have all endpoints with integrated=true', () => {
    const integrated = MODULE_READINESS.filter((m) => m.integrationStatus === 'integrated');
    for (const mod of integrated) {
      for (const ep of mod.endpoints) {
        expect(ep.integrated).toBe(true);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// getModuleReadiness
// ---------------------------------------------------------------------------
describe('getModuleReadiness', () => {
  it('returns readiness for an existing module', () => {
    const result = getModuleReadiness('dashboard');
    expect(result).toBeDefined();
    expect(result?.module).toBe('dashboard');
    expect(result?.status).toBe('ready');
  });

  it('returns readiness for the auth module', () => {
    const result = getModuleReadiness('auth');
    expect(result).toBeDefined();
    expect(result?.module).toBe('auth');
    expect(result?.integrationStatus).toBe('integrated');
  });

  it('returns readiness for the context module', () => {
    const result = getModuleReadiness('context');
    expect(result).toBeDefined();
    expect(result?.module).toBe('context');
    expect(result?.integrationStatus).toBe('integrated');
  });

  it('returns readiness for the obras module as integrated', () => {
    const result = getModuleReadiness('obras');
    expect(result).toBeDefined();
    expect(result?.module).toBe('obras');
    expect(result?.integrationStatus).toBe('integrated');
    expect(result?.endpoints.every((ep) => ep.integrated)).toBe(true);
  });

  it('returns readiness for the rh module as fully integrated', () => {
    const result = getModuleReadiness('rh');
    expect(result).toBeDefined();
    expect(result?.module).toBe('rh');
    expect(result?.integrationStatus).toBe('integrated');
    expect(result?.endpoints.every((ep) => ep.integrated)).toBe(true);
  });

  it('returns readiness for the horas-extras module as integrated', () => {
    const result = getModuleReadiness('horas-extras');
    expect(result).toBeDefined();
    expect(result?.module).toBe('horas-extras');
    expect(result?.integrationStatus).toBe('integrated');
    expect(result?.endpoints.every((ep) => ep.integrated)).toBe(true);
  });

  it('returns readiness for fopag module as integrated', () => {
    const result = getModuleReadiness('fopag');
    expect(result).toBeDefined();
    expect(result?.integrationStatus).toBe('integrated');
    expect(result?.endpoints.every((ep) => ep.integrated)).toBe(true);
  });

  it('returns readiness for financeiro module as integrated', () => {
    const result = getModuleReadiness('financeiro');
    expect(result).toBeDefined();
    expect(result?.integrationStatus).toBe('integrated');
    expect(result?.endpoints.every((ep) => ep.integrated)).toBe(true);
  });

  it('returns readiness for compras module as integrated with all 5 endpoints', () => {
    const result = getModuleReadiness('compras');
    expect(result).toBeDefined();
    expect(result?.module).toBe('compras');
    expect(result?.integrationStatus).toBe('integrated');
    expect(result?.endpoints).toHaveLength(5);
    expect(result?.endpoints.every((ep) => ep.integrated)).toBe(true);
  });

  it('returns undefined for a nonexistent module', () => {
    expect(getModuleReadiness('nonexistent')).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// getReadyModules
// ---------------------------------------------------------------------------
describe('getReadyModules', () => {
  it('returns only modules with status "ready"', () => {
    const ready = getReadyModules();
    for (const mod of ready) {
      expect(mod.status).toBe('ready');
    }
  });

  it('includes the 12 modules that are ready (including auth and context)', () => {
    const readyNames = getReadyModules().map((m) => m.module);
    expect(readyNames).toContain('auth');
    expect(readyNames).toContain('context');
    expect(readyNames).toContain('dashboard');
    expect(readyNames).toContain('obras');
    expect(readyNames).toContain('rh');
    expect(readyNames).toContain('horas-extras');
    expect(readyNames).toContain('fopag');
    expect(readyNames).toContain('compras');
    expect(readyNames).toContain('financeiro');
    expect(readyNames).toContain('fiscal');
    expect(readyNames).toContain('relatorios');
  });

  it('does not include partial modules', () => {
    const readyNames = getReadyModules().map((m) => m.module);
    expect(readyNames).not.toContain('estoque');
    expect(readyNames).not.toContain('medicoes');
    expect(readyNames).not.toContain('documentos');
  });
});

// ---------------------------------------------------------------------------
// getIntegratedModules
// ---------------------------------------------------------------------------
describe('getIntegratedModules', () => {
  it('returns only modules with integrationStatus "integrated"', () => {
    const integrated = getIntegratedModules();
    for (const mod of integrated) {
      expect(mod.integrationStatus).toBe('integrated');
    }
  });

  it('includes auth, context, dashboard, obras, rh, horas-extras, fopag, financeiro, compras, fiscal, and relatorios as integrated modules', () => {
    const integratedNames = getIntegratedModules().map((m) => m.module);
    expect(integratedNames).toContain('auth');
    expect(integratedNames).toContain('context');
    expect(integratedNames).toContain('dashboard');
    expect(integratedNames).toContain('obras');
    expect(integratedNames).toContain('rh');
    expect(integratedNames).toContain('horas-extras');
    expect(integratedNames).toContain('fopag');
    expect(integratedNames).toContain('financeiro');
    expect(integratedNames).toContain('compras');
    expect(integratedNames).toContain('fiscal');
    expect(integratedNames).toContain('relatorios');
    expect(integratedNames).toHaveLength(11);
  });
});
