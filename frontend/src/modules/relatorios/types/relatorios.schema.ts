import { z } from 'zod';

export const relatorioCategoriaSchema = z.enum([
  'obras',
  'rh',
  'horas-extras',
  'fopag',
  'compras',
  'fiscal',
  'financeiro',
  'estoque',
  'medicoes',
  'documentos',
]);

export const relatorioDisponibilidadeSchema = z.enum([
  'disponivel',
  'em_preparacao',
  'planejado',
]);

export const relatorioSaidaSchema = z.enum(['pdf', 'xlsx', 'csv', 'dashboard']);

export type RelatorioCategoria = z.infer<typeof relatorioCategoriaSchema>;
export type RelatorioDisponibilidade = z.infer<typeof relatorioDisponibilidadeSchema>;
export type RelatorioSaida = z.infer<typeof relatorioSaidaSchema>;
