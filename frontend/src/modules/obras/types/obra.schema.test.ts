import { describe, it, expect } from 'vitest';
import { obraStatusSchema, obraTipoSchema, obraFormSchema } from './obra.schema';
import { obraFiltersSchema, defaultObraFilters } from './obra-filters.schema';

// ---------------------------------------------------------------------------
// Obra Enum Schemas
// ---------------------------------------------------------------------------
describe('obraStatusSchema', () => {
  it.each(['planejamento', 'em_andamento', 'paralisada', 'concluida', 'cancelada'])(
    'accepts valid status: %s',
    (status) => {
      expect(obraStatusSchema.safeParse(status).success).toBe(true);
    },
  );

  it('rejects invalid status', () => {
    expect(obraStatusSchema.safeParse('invalido').success).toBe(false);
  });

  it('rejects empty string', () => {
    expect(obraStatusSchema.safeParse('').success).toBe(false);
  });

  it('rejects null', () => {
    expect(obraStatusSchema.safeParse(null).success).toBe(false);
  });
});

describe('obraTipoSchema', () => {
  it.each(['residencial', 'comercial', 'industrial', 'infraestrutura', 'reforma', 'outros'])(
    'accepts valid tipo: %s',
    (tipo) => {
      expect(obraTipoSchema.safeParse(tipo).success).toBe(true);
    },
  );

  it('rejects invalid tipo', () => {
    expect(obraTipoSchema.safeParse('invalido').success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Obra Form Schema
// ---------------------------------------------------------------------------
describe('obraFormSchema', () => {
  const validForm = {
    codigo: 'OBR-001',
    nome: 'Obra Teste',
    descricao: 'Descrição da obra',
    status: 'em_andamento',
    tipo: 'residencial',
    clienteId: 'cli-1',
    responsavelId: 'resp-1',
    filialId: 'fil-1',
    endereco: 'Rua A, 100',
    cidade: 'São Paulo',
    uf: 'SP',
    dataInicio: '2026-01-01',
    dataPrevisaoFim: '2027-01-01',
    orcamentoPrevisto: 1000000,
  };

  it('accepts valid complete form', () => {
    const result = obraFormSchema.safeParse(validForm);
    expect(result.success).toBe(true);
  });

  it('rejects missing codigo', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { codigo, ...rest } = validForm;
    expect(obraFormSchema.safeParse(rest).success).toBe(false);
  });

  it('rejects empty nome', () => {
    const result = obraFormSchema.safeParse({ ...validForm, nome: '' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid status value', () => {
    const result = obraFormSchema.safeParse({ ...validForm, status: 'invalido' });
    expect(result.success).toBe(false);
  });

  it('rejects negative orcamentoPrevisto', () => {
    const result = obraFormSchema.safeParse({ ...validForm, orcamentoPrevisto: -1 });
    expect(result.success).toBe(false);
  });

  it('rejects uf with wrong length', () => {
    const result = obraFormSchema.safeParse({ ...validForm, uf: 'ABC' });
    expect(result.success).toBe(false);
  });

  it('accepts form with explicit optional field values', () => {
    const withOptionals = {
      ...validForm,
      descricao: '',
      endereco: '',
      cidade: '',
      uf: 'SP',
    };
    const result = obraFormSchema.safeParse(withOptionals);
    expect(result.success).toBe(true);
  });

  it('rejects missing required clienteId', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { clienteId, ...rest } = validForm;
    expect(obraFormSchema.safeParse(rest).success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Obra Filters Schema
// ---------------------------------------------------------------------------
describe('obraFiltersSchema', () => {
  it('accepts empty object (all defaults)', () => {
    const result = obraFiltersSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.search).toBe('');
    }
  });

  it('accepts valid filter with search', () => {
    const result = obraFiltersSchema.safeParse({ search: 'residencial' });
    expect(result.success).toBe(true);
  });

  it('accepts valid filter with status', () => {
    const result = obraFiltersSchema.safeParse({ status: 'em_andamento' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid status in filter', () => {
    const result = obraFiltersSchema.safeParse({ status: 'invalido' });
    expect(result.success).toBe(false);
  });

  it('accepts filter with tipo', () => {
    const result = obraFiltersSchema.safeParse({ tipo: 'comercial' });
    expect(result.success).toBe(true);
  });

  it('default filters match expected shape', () => {
    expect(defaultObraFilters.search).toBe('');
    expect(defaultObraFilters.status).toBeUndefined();
    expect(defaultObraFilters.tipo).toBeUndefined();
    expect(defaultObraFilters.filialId).toBeUndefined();
    expect(defaultObraFilters.responsavelId).toBeUndefined();
  });
});
