import { z } from 'zod';

export const medicaoStatusSchema = z.enum([
  'em_elaboracao',
  'em_aprovacao',
  'aprovada',
  'rejeitada',
  'faturada_parcial',
  'faturada',
]);

export const medicaoOrigemSchema = z.enum(['obra', 'contrato', 'aditivo', 'ajuste']);
export const medicaoFaturamentoStatusSchema = z.enum(['nao_iniciado', 'preparado', 'emitido', 'recebido']);
export const medicaoAprovacaoStatusSchema = z.enum(['pendente_engenharia', 'pendente_cliente', 'aprovada', 'rejeitada']);

export type MedicaoStatus = z.infer<typeof medicaoStatusSchema>;
export type MedicaoOrigem = z.infer<typeof medicaoOrigemSchema>;
export type MedicaoFaturamentoStatus = z.infer<typeof medicaoFaturamentoStatusSchema>;
export type MedicaoAprovacaoStatus = z.infer<typeof medicaoAprovacaoStatusSchema>;
