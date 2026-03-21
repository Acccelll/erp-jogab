import { z } from 'zod';
import { relatorioCategoriaSchema, relatorioDisponibilidadeSchema, relatorioSaidaSchema } from './relatorios.schema';

export const relatoriosFiltersSchema = z.object({
  search: z.string().optional().default(''),
  categoria: relatorioCategoriaSchema.optional(),
  disponibilidade: relatorioDisponibilidadeSchema.optional(),
  formato: relatorioSaidaSchema.optional(),
  competencia: z.string().optional(),
  obraId: z.string().optional(),
});

export type RelatoriosFiltersData = z.infer<typeof relatoriosFiltersSchema>;

export const defaultRelatoriosFilters: RelatoriosFiltersData = {
  search: '',
  categoria: undefined,
  disponibilidade: undefined,
  formato: undefined,
  competencia: undefined,
  obraId: undefined,
};
