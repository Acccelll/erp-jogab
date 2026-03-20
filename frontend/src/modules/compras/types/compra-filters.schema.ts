import { z } from 'zod';
import { compraCategoriaSchema, compraPrioridadeSchema, compraStatusSchema } from './compra.schema';

export const compraFiltersSchema = z.object({
  search: z.string().optional().default(''),
  status: compraStatusSchema.optional(),
  categoria: compraCategoriaSchema.optional(),
  prioridade: compraPrioridadeSchema.optional(),
  competencia: z.string().optional(),
  obraId: z.string().optional(),
  fornecedorId: z.string().optional(),
});

export type CompraFiltersData = z.infer<typeof compraFiltersSchema>;

export const defaultCompraFilters: CompraFiltersData = {
  search: '',
  status: undefined,
  categoria: undefined,
  prioridade: undefined,
  competencia: undefined,
  obraId: undefined,
  fornecedorId: undefined,
};
