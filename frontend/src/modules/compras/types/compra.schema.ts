import { z } from 'zod';

export const compraStatusSchema = z.enum([
  'rascunho',
  'pendente_aprovacao',
  'em_cotacao',
  'cotada',
  'pedido_emitido',
  'aguardando_fiscal',
  'recebimento_parcial',
  'concluida',
  'cancelada',
]);

export const compraCategoriaSchema = z.enum([
  'material_obra',
  'equipamento',
  'servico',
  'administrativo',
]);

export const compraPrioridadeSchema = z.enum(['baixa', 'media', 'alta', 'critica']);

export const compraOrigemSchema = z.enum(['obra', 'suprimentos', 'administrativo']);

export type CompraStatus = z.infer<typeof compraStatusSchema>;
export type CompraCategoria = z.infer<typeof compraCategoriaSchema>;
export type CompraPrioridade = z.infer<typeof compraPrioridadeSchema>;
export type CompraOrigem = z.infer<typeof compraOrigemSchema>;
