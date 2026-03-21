import { z } from 'zod';

export const documentoTipoSchema = z.enum([
  'contrato',
  'certidao',
  'aso',
  'fiscal',
  'fornecedor',
  'seguranca',
  'licenca',
]);

export const documentoEntidadeSchema = z.enum([
  'obra',
  'funcionario',
  'fornecedor',
  'contrato',
  'empresa',
]);

export const documentoStatusSchema = z.enum([
  'vigente',
  'a_vencer',
  'vencido',
  'pendente_envio',
  'em_analise',
  'arquivado',
]);

export const documentoAlertaSchema = z.enum(['sem_alerta', 'atencao', 'critico']);

export type DocumentoTipo = z.infer<typeof documentoTipoSchema>;
export type DocumentoEntidade = z.infer<typeof documentoEntidadeSchema>;
export type DocumentoStatus = z.infer<typeof documentoStatusSchema>;
export type DocumentoAlerta = z.infer<typeof documentoAlertaSchema>;
