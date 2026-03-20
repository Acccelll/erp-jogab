import { z } from 'zod';
import { fopagCompetenciaStatusSchema } from './fopag.schema';

export const fopagFiltersSchema = z.object({
  search: z.string().optional().default(''),
  status: fopagCompetenciaStatusSchema.optional(),
  competencia: z.string().optional(),
  obraId: z.string().optional(),
});

export type FopagFiltersData = z.infer<typeof fopagFiltersSchema>;

export const defaultFopagFilters: FopagFiltersData = {
  search: '',
  status: undefined,
  competencia: undefined,
  obraId: undefined,
};
