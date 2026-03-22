import { z } from 'zod';
import { medicaoAprovacaoStatusSchema, medicaoFaturamentoStatusSchema, medicaoStatusSchema } from './medicoes.schema';

export const medicoesFiltersSchema = z.object({
  search: z.string().optional().default(''),
  status: medicaoStatusSchema.optional(),
  aprovacaoStatus: medicaoAprovacaoStatusSchema.optional(),
  faturamentoStatus: medicaoFaturamentoStatusSchema.optional(),
  competencia: z.string().optional(),
  obraId: z.string().optional(),
  contratoId: z.string().optional(),
});

export type MedicoesFiltersData = z.infer<typeof medicoesFiltersSchema>;

export const defaultMedicoesFilters: MedicoesFiltersData = {
  search: '',
  status: undefined,
  aprovacaoStatus: undefined,
  faturamentoStatus: undefined,
  competencia: undefined,
  obraId: undefined,
  contratoId: undefined,
};
