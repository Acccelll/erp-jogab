import { z } from 'zod';
import {
  fiscalDocumentoTipoSchema,
  fiscalIntegracaoStatusSchema,
  fiscalStatusSchema,
  fiscalTipoOperacaoSchema,
} from './fiscal.schema';

export const fiscalFiltersSchema = z.object({
  search: z.string().optional().default(''),
  tipoOperacao: fiscalTipoOperacaoSchema.optional(),
  documentoTipo: fiscalDocumentoTipoSchema.optional(),
  status: fiscalStatusSchema.optional(),
  estoqueStatus: fiscalIntegracaoStatusSchema.optional(),
  financeiroStatus: fiscalIntegracaoStatusSchema.optional(),
  competencia: z.string().optional(),
  obraId: z.string().optional(),
});

export type FiscalFiltersData = z.infer<typeof fiscalFiltersSchema>;

export const defaultFiscalFilters: FiscalFiltersData = {
  search: '',
  tipoOperacao: undefined,
  documentoTipo: undefined,
  status: undefined,
  estoqueStatus: undefined,
  financeiroStatus: undefined,
  competencia: undefined,
  obraId: undefined,
};
