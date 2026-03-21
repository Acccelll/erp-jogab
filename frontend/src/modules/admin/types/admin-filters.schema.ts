import { z } from 'zod';
import { adminCategoriaSchema, adminStatusSchema } from './admin.schema';

export const adminFiltersSchema = z.object({
  search: z.string().optional().default(''),
  categoria: adminCategoriaSchema.optional(),
  status: adminStatusSchema.optional(),
  competencia: z.string().optional(),
  obraId: z.string().optional(),
});

export type AdminFiltersData = z.infer<typeof adminFiltersSchema>;

export const defaultAdminFilters: AdminFiltersData = {
  search: '',
  categoria: undefined,
  status: undefined,
  competencia: undefined,
  obraId: undefined,
};
