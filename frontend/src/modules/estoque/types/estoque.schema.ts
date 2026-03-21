import { z } from 'zod';

export const estoqueStatusSchema = z.enum([
  'disponivel',
  'baixo',
  'reservado',
  'aguardando_recebimento',
  'em_transferencia',
  'bloqueado',
  'sem_saldo',
]);

export const estoqueTipoItemSchema = z.enum([
  'material',
  'equipamento',
  'epi',
  'ferramenta',
  'combustivel',
]);

export const estoqueMovimentacaoTipoSchema = z.enum([
  'entrada_compra',
  'saida_consumo',
  'transferencia_envio',
  'transferencia_recebimento',
  'ajuste',
  'devolucao',
]);

export const estoqueOrigemSchema = z.enum(['compras', 'fiscal', 'obra', 'financeiro', 'manual']);

export type EstoqueStatus = z.infer<typeof estoqueStatusSchema>;
export type EstoqueTipoItem = z.infer<typeof estoqueTipoItemSchema>;
export type EstoqueMovimentacaoTipo = z.infer<typeof estoqueMovimentacaoTipoSchema>;
export type EstoqueOrigem = z.infer<typeof estoqueOrigemSchema>;
