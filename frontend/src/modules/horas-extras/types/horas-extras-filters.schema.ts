import { z } from 'zod';
import { horaExtraStatusSchema, horaExtraTipoSchema } from './horas-extras.schema';

export const horasExtrasFiltersSchema = z.object({
  search: z.string().optional().default(''),
  status: horaExtraStatusSchema.optional(),
  tipo: horaExtraTipoSchema.optional(),
  competencia: z.string().optional(),
  obraId: z.string().optional(),
  filialId: z.string().optional(),
});

export type HorasExtrasFiltersData = z.infer<typeof horasExtrasFiltersSchema>;

export const defaultHorasExtrasFilters: HorasExtrasFiltersData = {
  search: '',
  status: undefined,
  tipo: undefined,
  competencia: undefined,
  obraId: undefined,
  filialId: undefined,
};
