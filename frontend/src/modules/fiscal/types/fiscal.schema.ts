import { z } from 'zod';

export const fiscalDocumentoStatusSchema = z.enum([
  'pendente_escrituracao',
  'aguardando_validacao',
  'aguardando_financeiro',
  'escriturado',
  'rejeitado',
  'cancelado',
]);

export const fiscalDocumentoTipoSchema = z.enum([
  'nfe_entrada',
  'nfse_entrada',
  'cte_entrada',
  'nfe_saida',
  'nfse_saida',
]);

export const fiscalFluxoSchema = z.enum(['entrada', 'saida']);

export type FiscalDocumentoStatus = z.infer<typeof fiscalDocumentoStatusSchema>;
export type FiscalDocumentoTipo = z.infer<typeof fiscalDocumentoTipoSchema>;
export type FiscalFluxo = z.infer<typeof fiscalFluxoSchema>;
