import { z } from 'zod';

export const fiscalTipoOperacaoSchema = z.enum(['entrada', 'saida']);
export const fiscalDocumentoTipoSchema = z.enum(['nfe', 'nfse', 'cte', 'guia']);
export const fiscalStatusSchema = z.enum([
  'pendente',
  'em_validacao',
  'validado',
  'integrado_estoque',
  'integrado_financeiro',
  'faturado',
  'erro',
  'cancelado',
]);
export const fiscalIntegracaoStatusSchema = z.enum(['nao_aplicavel', 'pendente', 'integrado', 'erro']);

export type FiscalTipoOperacao = z.infer<typeof fiscalTipoOperacaoSchema>;
export type FiscalDocumentoTipo = z.infer<typeof fiscalDocumentoTipoSchema>;
export type FiscalStatus = z.infer<typeof fiscalStatusSchema>;
export type FiscalIntegracaoStatus = z.infer<typeof fiscalIntegracaoStatusSchema>;
