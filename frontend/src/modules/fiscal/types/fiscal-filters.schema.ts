import { z } from 'zod';
import { fiscalDocumentoStatusSchema, fiscalDocumentoTipoSchema, fiscalFluxoSchema } from './fiscal.schema';

export const fiscalFiltersSchema = z.object({
  search: z.string().optional().default(''),
  status: fiscalDocumentoStatusSchema.optional(),
  tipo: fiscalDocumentoTipoSchema.optional(),
  fluxo: fiscalFluxoSchema.optional(),
  competencia: z.string().optional(),
  obraId: z.string().optional(),
});

export type FiscalFiltersData = z.infer<typeof fiscalFiltersSchema>;

export const defaultFiscalFilters: FiscalFiltersData = {
  search: '',
  status: undefined,
  tipo: undefined,
  fluxo: undefined,
  competencia: undefined,
  obraId: undefined,
};
