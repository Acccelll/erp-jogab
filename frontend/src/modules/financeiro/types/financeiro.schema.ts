import { z } from 'zod';

export const financeiroStatusSchema = z.enum([
  'previsto',
  'programado',
  'aguardando_documentos',
  'em_aprovacao',
  'vencido',
  'pago',
  'recebido',
]);

export const financeiroTipoSchema = z.enum(['pagar', 'receber']);
export const financeiroOrigemSchema = z.enum(['fopag', 'compras', 'fiscal', 'medicoes', 'manual']);
export const fluxoCaixaStatusSchema = z.enum(['superavit', 'equilibrio', 'atencao']);

export const tituloFinanceiroSchema = z.object({
  id: z.string(),
  codigo: z.string(),
  tipo: financeiroTipoSchema,
  status: financeiroStatusSchema,
  origem: financeiroOrigemSchema,
  descricao: z.string(),
  obraId: z.string(),
  obraNome: z.string(),
  centroCusto: z.string(),
  competencia: z.string(),
  documentoNumero: z.string().optional(),
  fornecedorCliente: z.string(),
  emissao: z.string(),
  vencimento: z.string(),
  pagamentoRecebimentoPrevisto: z.string(),
  valor: z.number(),
  valorPagoRecebido: z.number(),
  observacao: z.string().optional(),
});

export const fluxoCaixaItemSchema = z.object({
  periodo: z.string(),
  previstoEntrada: z.number(),
  previstoSaida: z.number(),
  realizadoEntrada: z.number(),
  realizadoSaida: z.number(),
  saldoProjetado: z.number(),
  status: fluxoCaixaStatusSchema,
});

export const financeiroFiltersSchema = z.object({
  search: z.string().optional(),
  status: financeiroStatusSchema.optional(),
  tipo: financeiroTipoSchema.optional(),
  origem: financeiroOrigemSchema.optional(),
  competencia: z.string().optional(),
  obraId: z.string().optional(),
});
