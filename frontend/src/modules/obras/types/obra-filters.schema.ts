/**
 * Schema de filtros do módulo Obras.
 */
import { z } from 'zod';
import { obraStatusSchema, obraTipoSchema } from './obra.schema';

export const obraFiltersSchema = z.object({
  search: z.string().optional().default(''),
  status: obraStatusSchema.optional(),
  tipo: obraTipoSchema.optional(),
  filialId: z.string().optional(),
  responsavelId: z.string().optional(),
});

export type ObraFiltersData = z.infer<typeof obraFiltersSchema>;

/** Filtros padrão (todos vazios) */
export const defaultObraFilters: ObraFiltersData = {
  search: '',
  status: undefined,
  tipo: undefined,
  filialId: undefined,
  responsavelId: undefined,
};
