import { describe, it, expect } from 'vitest';
import { funcionarioStatusSchema, tipoContratoSchema, funcionarioFormSchema } from './funcionario.schema';
import { funcionarioFiltersSchema, defaultFuncionarioFilters } from './funcionario-filters.schema';

// ---------------------------------------------------------------------------
// Funcionario Enum Schemas
// ---------------------------------------------------------------------------
describe('funcionarioStatusSchema', () => {
  it.each(['ativo', 'afastado', 'ferias', 'desligado', 'admissao_pendente'])('accepts valid status: %s', (status) => {
    expect(funcionarioStatusSchema.safeParse(status).success).toBe(true);
  });

  it('rejects invalid status', () => {
    expect(funcionarioStatusSchema.safeParse('invalido').success).toBe(false);
  });

  it('rejects null', () => {
    expect(funcionarioStatusSchema.safeParse(null).success).toBe(false);
  });
});

describe('tipoContratoSchema', () => {
  it.each(['clt', 'pj', 'temporario', 'estagio', 'aprendiz'])('accepts valid tipoContrato: %s', (tipo) => {
    expect(tipoContratoSchema.safeParse(tipo).success).toBe(true);
  });

  it('rejects invalid tipo', () => {
    expect(tipoContratoSchema.safeParse('freelancer').success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Funcionario Form Schema
// ---------------------------------------------------------------------------
describe('funcionarioFormSchema', () => {
  const validForm = {
    matricula: 'MAT-001',
    nome: 'João Silva',
    cpf: '12345678901',
    status: 'ativo',
    tipoContrato: 'clt',
    cargo: 'Engenheiro',
    funcao: 'Engenheiro Civil',
    departamento: 'Engenharia',
    filialId: 'fil-1',
    dataAdmissao: '2024-01-15',
    salarioBase: 5000,
    email: 'joao@empresa.com',
    telefone: '11999999999',
    cidade: 'São Paulo',
    uf: 'SP',
  };

  it('accepts valid complete form', () => {
    const result = funcionarioFormSchema.safeParse(validForm);
    expect(result.success).toBe(true);
  });

  it('rejects empty nome', () => {
    const result = funcionarioFormSchema.safeParse({ ...validForm, nome: '' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const result = funcionarioFormSchema.safeParse({ ...validForm, email: 'invalid' });
    expect(result.success).toBe(false);
  });

  it('rejects negative salarioBase', () => {
    const result = funcionarioFormSchema.safeParse({ ...validForm, salarioBase: -100 });
    expect(result.success).toBe(false);
  });

  it('accepts optional nullable fields as null', () => {
    const result = funcionarioFormSchema.safeParse({
      ...validForm,
      obraAlocadoId: null,
      centroCustoId: null,
      gestorId: null,
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid status', () => {
    const result = funcionarioFormSchema.safeParse({ ...validForm, status: 'invalido' });
    expect(result.success).toBe(false);
  });

  it('rejects uf with wrong length', () => {
    const result = funcionarioFormSchema.safeParse({ ...validForm, uf: 'ABC' });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Funcionario Filters Schema
// ---------------------------------------------------------------------------
describe('funcionarioFiltersSchema', () => {
  it('accepts empty object (all defaults)', () => {
    const result = funcionarioFiltersSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.search).toBe('');
    }
  });

  it('accepts valid filter with search and status', () => {
    const result = funcionarioFiltersSchema.safeParse({
      search: 'João',
      status: 'ativo',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid status in filter', () => {
    const result = funcionarioFiltersSchema.safeParse({ status: 'invalido' });
    expect(result.success).toBe(false);
  });

  it('accepts filter with tipoContrato', () => {
    const result = funcionarioFiltersSchema.safeParse({ tipoContrato: 'pj' });
    expect(result.success).toBe(true);
  });

  it('default filters match expected shape', () => {
    expect(defaultFuncionarioFilters.search).toBe('');
    expect(defaultFuncionarioFilters.status).toBeUndefined();
    expect(defaultFuncionarioFilters.tipoContrato).toBeUndefined();
    expect(defaultFuncionarioFilters.filialId).toBeUndefined();
    expect(defaultFuncionarioFilters.obraId).toBeUndefined();
  });
});
