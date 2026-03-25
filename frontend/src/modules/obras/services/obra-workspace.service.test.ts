import { describe, it, expect } from 'vitest';
import {
  OBRA_WORKSPACE_API_ENDPOINTS,
  fetchObraCronograma,
  fetchObraEquipe,
  fetchObraCompras,
  fetchObraFinanceiro,
  fetchObraDocumentos,
  fetchObraContratos,
  fetchObraEstoque,
  fetchObraMedicoes,
  fetchObraRh,
  fetchObraRiscos,
} from './obra-workspace.service';
import { fetchObras } from './obras.service';

// ---------------------------------------------------------------------------
// OBRA_WORKSPACE_API_ENDPOINTS
// ---------------------------------------------------------------------------
describe('OBRA_WORKSPACE_API_ENDPOINTS', () => {
  const tabs = [
    'cronograma',
    'equipe',
    'compras',
    'financeiro',
    'documentos',
    'contratos',
    'estoque',
    'medicoes',
    'rh',
    'riscos',
  ] as const;

  it('defines all 10 workspace tab endpoints', () => {
    for (const tab of tabs) {
      expect(typeof OBRA_WORKSPACE_API_ENDPOINTS[tab]).toBe('function');
    }
  });

  it('generates correct paths for each tab', () => {
    for (const tab of tabs) {
      expect(OBRA_WORKSPACE_API_ENDPOINTS[tab]('obra-1')).toBe(`/obras/obra-1/${tab}`);
    }
  });
});

// ---------------------------------------------------------------------------
// Workspace fetch functions (mock fallback)
// ---------------------------------------------------------------------------
describe('workspace fetch functions (mock fallback)', () => {
  let obraId: string;

  // Get a valid obra ID before running workspace tests
  beforeAll(async () => {
    const list = await fetchObras();
    obraId = list.data[0].id;
  });

  it('fetchObraCronograma returns items and resumoCards', async () => {
    const result = await fetchObraCronograma(obraId);
    expect(result).toBeDefined();
    expect(Array.isArray(result.items)).toBe(true);
    expect(Array.isArray(result.resumoCards)).toBe(true);
  });

  it('fetchObraEquipe returns items and resumoCards', async () => {
    const result = await fetchObraEquipe(obraId);
    expect(result).toBeDefined();
    expect(Array.isArray(result.items)).toBe(true);
    expect(Array.isArray(result.resumoCards)).toBe(true);
  });

  it('fetchObraCompras returns items and resumoCards', async () => {
    const result = await fetchObraCompras(obraId);
    expect(result).toBeDefined();
    expect(Array.isArray(result.items)).toBe(true);
    expect(Array.isArray(result.resumoCards)).toBe(true);
  });

  it('fetchObraFinanceiro returns items and resumoCards', async () => {
    const result = await fetchObraFinanceiro(obraId);
    expect(result).toBeDefined();
    expect(Array.isArray(result.items)).toBe(true);
    expect(Array.isArray(result.resumoCards)).toBe(true);
  });

  it('fetchObraDocumentos returns items and resumoCards', async () => {
    const result = await fetchObraDocumentos(obraId);
    expect(result).toBeDefined();
    expect(Array.isArray(result.items)).toBe(true);
    expect(Array.isArray(result.resumoCards)).toBe(true);
  });

  it('fetchObraContratos returns items and resumoCards', async () => {
    const result = await fetchObraContratos(obraId);
    expect(result).toBeDefined();
    expect(Array.isArray(result.items)).toBe(true);
    expect(Array.isArray(result.resumoCards)).toBe(true);
  });

  it('fetchObraEstoque returns items and resumoCards', async () => {
    const result = await fetchObraEstoque(obraId);
    expect(result).toBeDefined();
    expect(Array.isArray(result.items)).toBe(true);
    expect(Array.isArray(result.resumoCards)).toBe(true);
  });

  it('fetchObraMedicoes returns items and resumoCards', async () => {
    const result = await fetchObraMedicoes(obraId);
    expect(result).toBeDefined();
    expect(Array.isArray(result.items)).toBe(true);
    expect(Array.isArray(result.resumoCards)).toBe(true);
  });

  it('fetchObraRh returns items and resumoCards', async () => {
    const result = await fetchObraRh(obraId);
    expect(result).toBeDefined();
    expect(Array.isArray(result.items)).toBe(true);
    expect(Array.isArray(result.resumoCards)).toBe(true);
  });

  it('fetchObraRiscos returns items and resumoCards', async () => {
    const result = await fetchObraRiscos(obraId);
    expect(result).toBeDefined();
    expect(Array.isArray(result.items)).toBe(true);
    expect(Array.isArray(result.resumoCards)).toBe(true);
  });
});
