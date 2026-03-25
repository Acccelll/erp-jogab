import { describe, it, expect } from 'vitest';
import {
  normalizeObrasListResponse,
  OBRAS_API_ENDPOINTS,
  getObraFormReferenceData,
  fetchObras,
  fetchObraById,
  fetchObraDetail,
  createObra,
  updateObra,
} from './obras.service';
import type { ObrasListResponse, ObraCreatePayload } from '../types';

// ---------------------------------------------------------------------------
// OBRAS_API_ENDPOINTS
// ---------------------------------------------------------------------------
describe('OBRAS_API_ENDPOINTS', () => {
  it('defines list endpoint', () => {
    expect(OBRAS_API_ENDPOINTS.list).toBe('/obras');
  });

  it('defines detail endpoint with obraId', () => {
    expect(OBRAS_API_ENDPOINTS.detail('obra-1')).toBe('/obras/obra-1');
  });

  it('defines create endpoint', () => {
    expect(OBRAS_API_ENDPOINTS.create).toBe('/obras');
  });

  it('defines update endpoint with obraId', () => {
    expect(OBRAS_API_ENDPOINTS.update('obra-1')).toBe('/obras/obra-1');
  });
});

// ---------------------------------------------------------------------------
// normalizeObrasListResponse
// ---------------------------------------------------------------------------
describe('normalizeObrasListResponse', () => {
  it('returns safe defaults for null input', () => {
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

  it('returns safe defaults for undefined input', () => {
    const result = normalizeObrasListResponse(undefined);
    expect(result.data).toEqual([]);
    expect(result.kpis.totalObras).toBe(0);
    expect(result.total).toBe(0);
  });

  it('returns safe defaults for empty object', () => {
    const result = normalizeObrasListResponse({});
    expect(result.data).toEqual([]);
    expect(result.kpis.totalObras).toBe(0);
    expect(result.total).toBe(0);
  });

  it('returns safe defaults for partial kpis', () => {
    const result = normalizeObrasListResponse({
      kpis: { totalObras: 5 } as ObrasListResponse['kpis'],
    });
    expect(result.kpis.totalObras).toBe(5);
    expect(result.kpis.obrasAtivas).toBe(0);
    expect(result.kpis.obrasConcluidas).toBe(0);
    expect(result.kpis.obrasParalisadas).toBe(0);
    expect(result.kpis.orcamentoTotal).toBe(0);
    expect(result.kpis.custoRealizadoTotal).toBe(0);
  });

  it('preserves valid complete payload', () => {
    const input: ObrasListResponse = {
      data: [
        {
          id: 'obra-1',
          codigo: 'OBR-001',
          nome: 'Obra Teste',
          status: 'em_andamento',
          tipo: 'residencial',
          clienteNome: 'Cliente A',
          responsavelNome: 'Gestor A',
          filialNome: 'Filial 1',
          cidade: 'São Paulo',
          uf: 'SP',
          dataInicio: '2025-01-01',
          dataPrevisaoFim: '2026-12-31',
          percentualConcluido: 40,
          orcamentoPrevisto: 500000,
          custoRealizado: 200000,
          totalFuncionarios: 15,
        },
      ],
      kpis: {
        totalObras: 1,
        obrasAtivas: 1,
        obrasConcluidas: 0,
        obrasParalisadas: 0,
        orcamentoTotal: 500000,
        custoRealizadoTotal: 200000,
      },
      total: 1,
    };
    const result = normalizeObrasListResponse(input);
    expect(result).toEqual(input);
  });

  it('defaults data to empty array when not array', () => {
    const result = normalizeObrasListResponse({
      data: 'not-an-array' as unknown as ObrasListResponse['data'],
    });
    expect(result.data).toEqual([]);
  });

  it('preserves data array with items', () => {
    const items = [{ id: 'obra-1', nome: 'Test' }] as unknown as ObrasListResponse['data'];
    const result = normalizeObrasListResponse({ data: items });
    expect(result.data).toHaveLength(1);
  });

  it('defaults total to 0 when missing', () => {
    const result = normalizeObrasListResponse({ data: [] });
    expect(result.total).toBe(0);
  });

  it('preserves non-zero total', () => {
    const result = normalizeObrasListResponse({ total: 42 });
    expect(result.total).toBe(42);
  });
});

// ---------------------------------------------------------------------------
// getObraFormReferenceData
// ---------------------------------------------------------------------------
describe('getObraFormReferenceData', () => {
  it('returns reference data with clientes, responsaveis, filiais', () => {
    const ref = getObraFormReferenceData();
    expect(Array.isArray(ref.clientes)).toBe(true);
    expect(Array.isArray(ref.responsaveis)).toBe(true);
    expect(Array.isArray(ref.filiais)).toBe(true);
  });

  it('each option has value and label', () => {
    const ref = getObraFormReferenceData();
    for (const cliente of ref.clientes) {
      expect(cliente.value).toBeTruthy();
      expect(cliente.label).toBeTruthy();
    }
    for (const resp of ref.responsaveis) {
      expect(resp.value).toBeTruthy();
      expect(resp.label).toBeTruthy();
    }
    for (const filial of ref.filiais) {
      expect(filial.value).toBeTruthy();
      expect(filial.label).toBeTruthy();
    }
  });
});

// ---------------------------------------------------------------------------
// fetchObras (mock fallback — no real API available)
// ---------------------------------------------------------------------------
describe('fetchObras (mock fallback)', () => {
  it('returns a valid ObrasListResponse without filters', async () => {
    const result = await fetchObras();
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.kpis).toBeDefined();
    expect(result.kpis.totalObras).toBeGreaterThan(0);
    expect(result.total).toBeGreaterThan(0);
  });

  it('filters by search term', async () => {
    const allResult = await fetchObras();
    const firstObra = allResult.data[0];
    const filtered = await fetchObras({ search: firstObra.nome.slice(0, 5) });
    expect(filtered.data.length).toBeGreaterThan(0);
    expect(filtered.data.length).toBeLessThanOrEqual(allResult.data.length);
  });

  it('filters by status', async () => {
    const result = await fetchObras({ status: 'em_andamento' });
    for (const obra of result.data) {
      expect(obra.status).toBe('em_andamento');
    }
  });

  it('returns empty data for non-matching filter', async () => {
    const result = await fetchObras({ search: 'XXXYYY_NONEXISTENT_OBRA_ZZZ' });
    expect(result.data).toEqual([]);
    expect(result.total).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// fetchObraById (mock fallback)
// ---------------------------------------------------------------------------
describe('fetchObraById (mock fallback)', () => {
  it('returns an obra for a valid ID', async () => {
    const list = await fetchObras();
    const obraId = list.data[0].id;
    const obra = await fetchObraById(obraId);
    expect(obra).toBeDefined();
    expect(obra?.id).toBe(obraId);
  });

  it('returns null for a non-existent ID', async () => {
    const obra = await fetchObraById('nonexistent-id-xyz');
    expect(obra).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// fetchObraDetail (mock fallback)
// ---------------------------------------------------------------------------
describe('fetchObraDetail (mock fallback)', () => {
  it('returns obra, kpis, and resumoBlocos for a valid ID', async () => {
    const list = await fetchObras();
    const obraId = list.data[0].id;
    const detail = await fetchObraDetail(obraId);
    expect(detail.obra).toBeDefined();
    expect(detail.obra?.id).toBe(obraId);
    expect(detail.kpis).toBeDefined();
    expect(Array.isArray(detail.resumoBlocos)).toBe(true);
  });

  it('returns null obra for a non-existent ID', async () => {
    const detail = await fetchObraDetail('nonexistent-id-xyz');
    expect(detail.obra).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// createObra (mock fallback)
// ---------------------------------------------------------------------------
describe('createObra (mock fallback)', () => {
  it('creates an obra and returns mutation response', async () => {
    const ref = getObraFormReferenceData();
    const payload: ObraCreatePayload = {
      codigo: `OBR-TEST-${Date.now()}`,
      nome: 'Obra de Teste Automatizado',
      descricao: 'Descrição da obra de teste',
      status: 'planejamento',
      tipo: 'residencial',
      clienteId: ref.clientes[0]?.value ?? 'cliente-1',
      responsavelId: ref.responsaveis[0]?.value ?? 'resp-1',
      filialId: ref.filiais[0]?.value ?? 'fil-1',
      endereco: 'Rua Teste, 123',
      cidade: 'São Paulo',
      uf: 'SP',
      dataInicio: '2026-01-01',
      dataPrevisaoFim: '2027-12-31',
      orcamentoPrevisto: 1000000,
    };

    const result = await createObra(payload);
    expect(result.message).toBeTruthy();
    expect(result.obra).toBeDefined();
    expect(result.obra.nome).toBe(payload.nome);
    expect(result.obra.id).toBeTruthy();
  });

  it('rejects duplicate codigo', async () => {
    const list = await fetchObras();
    const existingCodigo = list.data[0].codigo;
    const ref = getObraFormReferenceData();

    const payload: ObraCreatePayload = {
      codigo: existingCodigo,
      nome: 'Obra Duplicada',
      descricao: '',
      status: 'planejamento',
      tipo: 'residencial',
      clienteId: ref.clientes[0]?.value ?? 'cliente-1',
      responsavelId: ref.responsaveis[0]?.value ?? 'resp-1',
      filialId: ref.filiais[0]?.value ?? 'fil-1',
      endereco: '',
      cidade: 'SP',
      uf: 'SP',
      dataInicio: '2026-01-01',
      dataPrevisaoFim: '2027-12-31',
      orcamentoPrevisto: 0,
    };

    await expect(createObra(payload)).rejects.toThrow();
  });
});

// ---------------------------------------------------------------------------
// updateObra (mock fallback)
// ---------------------------------------------------------------------------
describe('updateObra (mock fallback)', () => {
  it('updates an existing obra', async () => {
    const list = await fetchObras();
    const obraId = list.data[0].id;

    const result = await updateObra({
      id: obraId,
      codigo: list.data[0].codigo,
      nome: 'Nome Atualizado',
      descricao: 'Descrição atualizada',
      status: 'em_andamento',
      tipo: 'comercial',
      clienteId: 'cliente-1',
      responsavelId: 'resp-1',
      filialId: 'fil-1',
      endereco: 'Rua Atualizada, 456',
      cidade: 'Rio de Janeiro',
      uf: 'RJ',
      dataInicio: '2025-01-01',
      dataPrevisaoFim: '2027-06-30',
      orcamentoPrevisto: 2000000,
    });

    expect(result.message).toBeTruthy();
    expect(result.obra).toBeDefined();
    expect(result.obra.nome).toBe('Nome Atualizado');
  });

  it('rejects update for non-existent obra', async () => {
    await expect(
      updateObra({
        id: 'nonexistent-id',
        codigo: 'XXX',
        nome: 'Nope',
        descricao: '',
        status: 'planejamento',
        tipo: 'residencial',
        clienteId: 'x',
        responsavelId: 'x',
        filialId: 'x',
        endereco: '',
        cidade: '',
        uf: 'SP',
        dataInicio: '2026-01-01',
        dataPrevisaoFim: '2027-12-31',
        orcamentoPrevisto: 0,
      }),
    ).rejects.toThrow();
  });
});
