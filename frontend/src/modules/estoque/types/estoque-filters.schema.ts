import { z } from 'zod';
import { estoqueMovimentacaoTipoSchema, estoqueStatusSchema, estoqueTipoItemSchema } from './estoque.schema';

export const estoqueFiltersSchema = z.object({
  search: z.string().optional().default(''),
  status: estoqueStatusSchema.optional(),
  tipo: estoqueTipoItemSchema.optional(),
  localId: z.string().optional(),
  competencia: z.string().optional(),
  obraId: z.string().optional(),
  movimentacaoTipo: estoqueMovimentacaoTipoSchema.optional(),
});

export type EstoqueFiltersData = z.infer<typeof estoqueFiltersSchema>;

export const defaultEstoqueFilters: EstoqueFiltersData = {
  search: '',
  status: undefined,
  tipo: undefined,
  localId: undefined,
  competencia: undefined,
  obraId: undefined,
  movimentacaoTipo: undefined,
};
