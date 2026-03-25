import { z } from 'zod';

export const obraCronogramaStatusSchema = z.enum(['em_dia', 'atencao', 'atrasada', 'concluida']);

export const obraCronogramaItemSchema = z.object({
  id: z.string(),
  etapa: z.string(),
  responsavel: z.string(),
  inicioPrevisto: z.string(),
  fimPrevisto: z.string(),
  percentual: z.number(),
  status: obraCronogramaStatusSchema,
});

export const obraEquipeStatusSchema = z.enum(['alocado', 'ferias', 'desmobilizando']);

export const obraEquipeItemSchema = z.object({
  id: z.string(),
  nome: z.string(),
  funcao: z.string(),
  equipe: z.string(),
  status: obraEquipeStatusSchema,
  jornada: z.string(),
  funcionarioId: z.string(),
  funcionarioNome: z.string(),
  centroCustoNome: z.string(),
  percentual: z.number(),
});

export const obraComprasStatusSchema = z.enum([
  'em_cotacao',
  'pedido_emitido',
  'aguardando_fiscal',
  'recebimento_parcial',
]);

export const obraComprasItemSchema = z.object({
  id: z.string(),
  codigo: z.string(),
  objeto: z.string(),
  fornecedor: z.string(),
  status: obraComprasStatusSchema,
  valor: z.number(),
  previsaoEntrega: z.string(),
});

export const obraFinanceiroTipoSchema = z.enum(['pagar', 'receber']);
export const obraFinanceiroStatusSchema = z.enum(['programado', 'previsto', 'pago', 'recebido', 'vencido']);

export const obraFinanceiroItemSchema = z.object({
  id: z.string(),
  codigo: z.string(),
  descricao: z.string(),
  tipo: obraFinanceiroTipoSchema,
  status: obraFinanceiroStatusSchema,
  competencia: z.string(),
  valor: z.number(),
});

export const obraDocumentoStatusSchema = z.enum(['vigente', 'a_vencer', 'vencido', 'em_analise']);

export const obraDocumentoItemSchema = z.object({
  id: z.string(),
  codigo: z.string(),
  titulo: z.string(),
  tipo: z.string(),
  status: obraDocumentoStatusSchema,
  responsavel: z.string(),
  vencimento: z.string().optional(),
});

export const obraContratoTipoSchema = z.enum(['cliente', 'fornecedor', 'subcontrato']);
export const obraContratoStatusSchema = z.enum(['ativo', 'em_negociacao', 'suspenso', 'encerrado']);

export const obraContratoItemSchema = z.object({
  id: z.string(),
  codigo: z.string(),
  objeto: z.string(),
  contratado: z.string(),
  tipo: obraContratoTipoSchema,
  valorContrato: z.number(),
  valorAditivos: z.number(),
  dataInicio: z.string(),
  dataFim: z.string(),
  status: obraContratoStatusSchema,
});

export const obraEstoqueStatusSchema = z.enum(['disponivel', 'critico', 'esgotado']);

export const obraEstoqueItemSchema = z.object({
  id: z.string(),
  codigo: z.string(),
  descricao: z.string(),
  unidade: z.string(),
  saldoAtual: z.number(),
  consumoMes: z.number(),
  status: obraEstoqueStatusSchema,
  almoxarife: z.string(),
});

export const obraMedicaoStatusSchema = z.enum(['prevista', 'em_apuracao', 'aprovada', 'faturada']);

export const obraMedicaoItemSchema = z.object({
  id: z.string(),
  codigo: z.string(),
  descricao: z.string(),
  competencia: z.string(),
  percentualMedido: z.number(),
  valorMedido: z.number(),
  responsavel: z.string(),
  status: obraMedicaoStatusSchema,
});

export const obraRiscoProbabilidadeSchema = z.enum(['baixa', 'media', 'alta']);
export const obraRiscoImpactoSchema = z.enum(['baixo', 'medio', 'alto']);
export const obraRiscoStatusSchema = z.enum(['identificado', 'em_mitigacao', 'mitigado', 'materializado']);

export const obraRiscoItemSchema = z.object({
  id: z.string(),
  codigo: z.string(),
  titulo: z.string(),
  categoria: z.string(),
  probabilidade: obraRiscoProbabilidadeSchema,
  impacto: obraRiscoImpactoSchema,
  responsavel: z.string(),
  status: obraRiscoStatusSchema,
});

export const obraWorkspaceResumoCardSchema = z.object({
  id: z.string(),
  titulo: z.string(),
  descricao: z.string(),
  itens: z.array(
    z.object({
      label: z.string(),
      valor: z.string(),
      destaque: z.boolean().optional(),
    }),
  ),
});

export function createObraWorkspaceTabDataSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    items: z.array(itemSchema),
    resumoCards: z.array(obraWorkspaceResumoCardSchema),
  });
}
