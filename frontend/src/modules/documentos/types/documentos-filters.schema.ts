import { z } from 'zod';
import { documentoAlertaSchema, documentoEntidadeSchema, documentoStatusSchema, documentoTipoSchema } from './documentos.schema';

export const documentosFiltersSchema = z.object({
  search: z.string().optional().default(''),
  status: documentoStatusSchema.optional(),
  tipo: documentoTipoSchema.optional(),
  entidade: documentoEntidadeSchema.optional(),
  alerta: documentoAlertaSchema.optional(),
  competencia: z.string().optional(),
  obraId: z.string().optional(),
});

export type DocumentosFiltersData = z.infer<typeof documentosFiltersSchema>;

export const defaultDocumentosFilters: DocumentosFiltersData = {
  search: '',
  status: undefined,
  tipo: undefined,
  entidade: undefined,
  alerta: undefined,
  competencia: undefined,
  obraId: undefined,
};
