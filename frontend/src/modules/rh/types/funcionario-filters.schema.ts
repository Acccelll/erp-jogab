/**
 * Schema de filtros do módulo RH.
 */
import { z } from 'zod';
import { funcionarioStatusSchema, tipoContratoSchema } from './funcionario.schema';

export const funcionarioFiltersSchema = z.object({
  search: z.string().optional().default(''),
  status: funcionarioStatusSchema.optional(),
  tipoContrato: tipoContratoSchema.optional(),
  filialId: z.string().optional(),
  obraId: z.string().optional(),
  centroCustoId: z.string().optional(),
  departamento: z.string().optional(),
});

export type FuncionarioFiltersData = z.infer<typeof funcionarioFiltersSchema>;

/** Filtros padrão (todos vazios) */
export const defaultFuncionarioFilters: FuncionarioFiltersData = {
  search: '',
  status: undefined,
  tipoContrato: undefined,
  filialId: undefined,
  obraId: undefined,
  centroCustoId: undefined,
  departamento: undefined,
};
