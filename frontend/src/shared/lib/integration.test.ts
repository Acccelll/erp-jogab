import { describe, it, expect } from 'vitest';
import { getIntegrationConfig, getModuleReadiness, getReadyModules, MODULE_READINESS } from '@/shared/lib/integration';

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
  it('contains all 13 official modules', () => {
    const moduleNames = MODULE_READINESS.map((m) => m.module);
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

  it('every endpoint has a valid path, method, readiness, and description', () => {
    const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    const validReadiness = ['ready', 'partial', 'mock-only'];

    for (const mod of MODULE_READINESS) {
      for (const ep of mod.endpoints) {
        expect(ep.path).toMatch(/^\//);
        expect(validMethods).toContain(ep.method);
        expect(validReadiness).toContain(ep.readiness);
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

  it('includes the 9 modules that are ready', () => {
    const readyNames = getReadyModules().map((m) => m.module);
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
