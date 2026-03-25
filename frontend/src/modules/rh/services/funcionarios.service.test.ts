import { describe, it, expect } from 'vitest';
import {
  normalizeFuncionariosListResponse,
  RH_API_ENDPOINTS,
  fetchFuncionarios,
  fetchFuncionarioById,
  fetchFuncionarioDetail,
  createFuncionario,
  updateFuncionario,
} from './funcionarios.service';
import type { FuncionariosListResponse, FuncionarioCreatePayload, FuncionarioUpdatePayload } from '../types';

// ---------------------------------------------------------------------------
// RH_API_ENDPOINTS
// ---------------------------------------------------------------------------
describe('RH_API_ENDPOINTS', () => {
  it('defines list endpoint', () => {
    expect(RH_API_ENDPOINTS.list).toBe('/rh/funcionarios');
  });

  it('defines detail endpoint with funcionarioId', () => {
    expect(RH_API_ENDPOINTS.detail('func-1')).toBe('/rh/funcionarios/func-1');
  });

  it('defines create endpoint', () => {
    expect(RH_API_ENDPOINTS.create).toBe('/rh/funcionarios');
  });

  it('defines update endpoint with funcionarioId', () => {
    expect(RH_API_ENDPOINTS.update('func-1')).toBe('/rh/funcionarios/func-1');
  });
});

// ---------------------------------------------------------------------------
// normalizeFuncionariosListResponse
// ---------------------------------------------------------------------------
describe('normalizeFuncionariosListResponse', () => {
  it('returns safe defaults for null input', () => {
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

  it('returns safe defaults for undefined input', () => {
    const result = normalizeFuncionariosListResponse(undefined);
    expect(result.data).toEqual([]);
    expect(result.kpis.totalFuncionarios).toBe(0);
    expect(result.total).toBe(0);
  });

  it('returns safe defaults for empty object', () => {
    const result = normalizeFuncionariosListResponse({});
    expect(result.data).toEqual([]);
    expect(result.kpis.totalFuncionarios).toBe(0);
  });

  it('returns safe defaults for partial kpis', () => {
    const result = normalizeFuncionariosListResponse({
      kpis: { totalFuncionarios: 10 } as FuncionariosListResponse['kpis'],
    });
    expect(result.kpis.totalFuncionarios).toBe(10);
    expect(result.kpis.ativos).toBe(0);
    expect(result.kpis.afastados).toBe(0);
    expect(result.kpis.ferias).toBe(0);
    expect(result.kpis.desligados).toBe(0);
    expect(result.kpis.custoFolhaEstimado).toBe(0);
  });

  it('preserves valid complete payload', () => {
    const input: FuncionariosListResponse = {
      data: [
        {
          id: 'func-1',
          matricula: 'MAT-001',
          nome: 'João Silva',
          cpf: '000.000.000-00',
          status: 'ativo',
          tipoContrato: 'clt',
          cargo: 'Engenheiro',
          funcao: 'Eng. Civil',
          departamento: 'Engenharia',
          filialNome: 'Filial SP',
          obraAlocadoNome: 'Obra 1',
          salarioBase: 8000,
          dataAdmissao: '2024-01-01',
        },
      ],
      kpis: {
        totalFuncionarios: 1,
        ativos: 1,
        afastados: 0,
        ferias: 0,
        desligados: 0,
        custoFolhaEstimado: 8000,
      },
      total: 1,
    };
    const result = normalizeFuncionariosListResponse(input);
    expect(result).toEqual(input);
  });

  it('defaults data to empty array when not array', () => {
    const result = normalizeFuncionariosListResponse({
      data: 'not-an-array' as unknown as FuncionariosListResponse['data'],
    });
    expect(result.data).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// fetchFuncionarios (mock fallback)
// ---------------------------------------------------------------------------
describe('fetchFuncionarios (mock fallback)', () => {
  it('returns a valid FuncionariosListResponse without filters', async () => {
    const result = await fetchFuncionarios();
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.kpis).toBeDefined();
    expect(result.kpis.totalFuncionarios).toBeGreaterThan(0);
    expect(result.total).toBeGreaterThan(0);
  });

  it('filters by status', async () => {
    const result = await fetchFuncionarios({ status: 'ativo' });
    for (const func of result.data) {
      expect(func.status).toBe('ativo');
    }
  });

  it('returns empty data for non-matching search', async () => {
    const result = await fetchFuncionarios({ search: 'XXXYYY_NONEXISTENT_FUNC_ZZZ' });
    expect(result.data).toEqual([]);
    expect(result.total).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// fetchFuncionarioById (mock fallback)
// ---------------------------------------------------------------------------
describe('fetchFuncionarioById (mock fallback)', () => {
  it('returns a funcionario for a valid ID', async () => {
    const list = await fetchFuncionarios();
    const funcId = list.data[0].id;
    const func = await fetchFuncionarioById(funcId);
    expect(func).toBeDefined();
    expect(func?.id).toBe(funcId);
  });

  it('returns null for a non-existent ID', async () => {
    const func = await fetchFuncionarioById('nonexistent-id-xyz');
    expect(func).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// fetchFuncionarioDetail (mock fallback)
// ---------------------------------------------------------------------------
describe('fetchFuncionarioDetail (mock fallback)', () => {
  it('returns funcionario and resumoBlocos for a valid ID', async () => {
    const list = await fetchFuncionarios();
    const funcId = list.data[0].id;
    const detail = await fetchFuncionarioDetail(funcId);
    expect(detail.funcionario).toBeDefined();
    expect(detail.funcionario?.id).toBe(funcId);
    expect(Array.isArray(detail.resumoBlocos)).toBe(true);
  });

  it('returns null funcionario for a non-existent ID', async () => {
    const detail = await fetchFuncionarioDetail('nonexistent-id-xyz');
    expect(detail.funcionario).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// createFuncionario (mock fallback)
// ---------------------------------------------------------------------------
describe('createFuncionario (mock fallback)', () => {
  it('creates a funcionario and returns success response', async () => {
    const payload: FuncionarioCreatePayload = {
      matricula: `MAT-TEST-${Date.now()}`,
      nome: 'Funcionário Teste Criação',
      cpf: `${Date.now()}`.slice(0, 11),
      status: 'ativo',
      tipoContrato: 'clt',
      cargo: 'Engenheiro de Testes',
      funcao: 'Testador',
      departamento: 'QA',
      filialId: 'fil-1',
      dataAdmissao: '2025-01-15',
      salarioBase: 5000,
      email: 'teste@jogab.com',
      telefone: '11999990000',
      cidade: 'São Paulo',
      uf: 'SP',
    };

    const result = await createFuncionario(payload);
    expect(result.message).toBeDefined();
    expect(result.funcionario).toBeDefined();
    expect(result.funcionario.nome).toBe(payload.nome);
    expect(result.funcionario.matricula).toBe(payload.matricula);
    expect(result.funcionario.status).toBe('ativo');
    expect(result.funcionario.id).toBeDefined();
  });

  it('rejects duplicate CPF', async () => {
    const list = await fetchFuncionarios();
    const existing = list.data[0];

    const payload: FuncionarioCreatePayload = {
      matricula: `MAT-UNIQUE-${Date.now()}`,
      nome: 'Duplicate CPF Test',
      cpf: existing.cpf,
      status: 'ativo',
      tipoContrato: 'clt',
      cargo: 'Cargo',
      funcao: 'Funcao',
      departamento: 'Depto',
      filialId: 'fil-1',
      dataAdmissao: '2025-01-15',
      salarioBase: 3000,
      email: 'dup@jogab.com',
      telefone: '11999990001',
      cidade: 'SP',
      uf: 'SP',
    };

    await expect(createFuncionario(payload)).rejects.toThrow('CPF');
  });

  it('sets dataDesligamento when status is desligado', async () => {
    const payload: FuncionarioCreatePayload = {
      matricula: `MAT-DESL-${Date.now()}`,
      nome: 'Funcionário Desligado',
      cpf: `DES${Date.now()}`.slice(0, 11),
      status: 'desligado',
      tipoContrato: 'clt',
      cargo: 'Ex-Funcionário',
      funcao: 'N/A',
      departamento: 'Saída',
      filialId: 'fil-1',
      dataAdmissao: '2024-01-01',
      salarioBase: 3000,
      email: 'desl@jogab.com',
      telefone: '11999990002',
      cidade: 'SP',
      uf: 'SP',
    };

    const result = await createFuncionario(payload);
    expect(result.funcionario.dataDesligamento).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// updateFuncionario (mock fallback)
// ---------------------------------------------------------------------------
describe('updateFuncionario (mock fallback)', () => {
  it('updates an existing funcionario and returns success response', async () => {
    const list = await fetchFuncionarios();
    const funcId = list.data[0].id;

    const payload: FuncionarioUpdatePayload = {
      id: funcId,
      nome: 'Nome Atualizado Teste',
      cargo: 'Cargo Atualizado',
    } as FuncionarioUpdatePayload;

    const result = await updateFuncionario(payload);
    expect(result.message).toBeDefined();
    expect(result.funcionario).toBeDefined();
    expect(result.funcionario.id).toBe(funcId);
    expect(result.funcionario.nome).toBe('Nome Atualizado Teste');
    expect(result.funcionario.cargo).toBe('Cargo Atualizado');
  });

  it('throws error for non-existent funcionario', async () => {
    const payload: FuncionarioUpdatePayload = {
      id: 'nonexistent-id-xyz',
      nome: 'Should Fail',
    } as FuncionarioUpdatePayload;

    await expect(updateFuncionario(payload)).rejects.toThrow('não encontrado');
  });

  it('reflects update in subsequent fetch', async () => {
    const list = await fetchFuncionarios();
    const funcId = list.data[0].id;
    const originalName = list.data[0].nome;

    const newName = `Updated-${Date.now()}`;
    await updateFuncionario({ id: funcId, nome: newName } as FuncionarioUpdatePayload);

    const updated = await fetchFuncionarioById(funcId);
    expect(updated?.nome).toBe(newName);

    // Restore original name
    await updateFuncionario({ id: funcId, nome: originalName } as FuncionarioUpdatePayload);
  });
});
