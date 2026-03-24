import { describe, it, expect } from 'vitest';
import { compraStatusSchema, compraCategoriaSchema, compraPrioridadeSchema, compraOrigemSchema } from './compra.schema';
import { compraFiltersSchema, defaultCompraFilters } from './compra-filters.schema';

// ---------------------------------------------------------------------------
// Compra Enum Schemas
// ---------------------------------------------------------------------------
describe('compraStatusSchema', () => {
  it.each([
    'rascunho',
    'pendente_aprovacao',
    'em_cotacao',
    'cotada',
    'pedido_emitido',
    'aguardando_fiscal',
    'recebimento_parcial',
    'concluida',
    'cancelada',
  ])('accepts valid status: %s', (status) => {
    expect(compraStatusSchema.safeParse(status).success).toBe(true);
  });

  it('rejects invalid status', () => {
    expect(compraStatusSchema.safeParse('invalido').success).toBe(false);
  });
});

describe('compraCategoriaSchema', () => {
  it.each(['material_obra', 'equipamento', 'servico', 'administrativo'])('accepts valid categoria: %s', (cat) => {
    expect(compraCategoriaSchema.safeParse(cat).success).toBe(true);
  });

  it('rejects invalid categoria', () => {
    expect(compraCategoriaSchema.safeParse('outro').success).toBe(false);
  });
});

describe('compraPrioridadeSchema', () => {
  it.each(['baixa', 'media', 'alta', 'critica'])('accepts valid prioridade: %s', (p) => {
    expect(compraPrioridadeSchema.safeParse(p).success).toBe(true);
  });

  it('rejects invalid prioridade', () => {
    expect(compraPrioridadeSchema.safeParse('urgente').success).toBe(false);
  });
});

describe('compraOrigemSchema', () => {
  it.each(['obra', 'suprimentos', 'administrativo'])('accepts valid origem: %s', (o) => {
    expect(compraOrigemSchema.safeParse(o).success).toBe(true);
  });

  it('rejects invalid origem', () => {
    expect(compraOrigemSchema.safeParse('externo').success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Compra Filters Schema
// ---------------------------------------------------------------------------
describe('compraFiltersSchema', () => {
  it('accepts empty object (all defaults)', () => {
    const result = compraFiltersSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.search).toBe('');
    }
  });

  it('accepts valid combined filters', () => {
    const result = compraFiltersSchema.safeParse({
      search: 'cimento',
      status: 'em_cotacao',
      categoria: 'material_obra',
      prioridade: 'alta',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid status in filter', () => {
    expect(compraFiltersSchema.safeParse({ status: 'invalido' }).success).toBe(false);
  });

  it('default filters match expected shape', () => {
    expect(defaultCompraFilters.search).toBe('');
    expect(defaultCompraFilters.status).toBeUndefined();
    expect(defaultCompraFilters.categoria).toBeUndefined();
    expect(defaultCompraFilters.prioridade).toBeUndefined();
  });
});
