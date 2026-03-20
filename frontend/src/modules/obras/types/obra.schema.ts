/**
 * Schemas Zod do módulo Obras.
 *
 * Usados para validação de formulários (React Hook Form + Zod).
 */
import { z } from 'zod';

export const obraStatusSchema = z.enum([
  'planejamento',
  'em_andamento',
  'paralisada',
  'concluida',
  'cancelada',
]);

export const obraTipoSchema = z.enum([
  'residencial',
  'comercial',
  'industrial',
  'infraestrutura',
  'reforma',
  'outros',
]);

/** Schema para criação/edição de obra */
export const obraFormSchema = z.object({
  codigo: z.string().min(1, 'Código é obrigatório').max(20, 'Máximo 20 caracteres'),
  nome: z.string().min(1, 'Nome é obrigatório').max(200, 'Máximo 200 caracteres'),
  descricao: z.string().max(1000, 'Máximo 1000 caracteres').optional().default(''),
  status: obraStatusSchema,
  tipo: obraTipoSchema,
  clienteId: z.string().min(1, 'Cliente é obrigatório'),
  responsavelId: z.string().min(1, 'Responsável é obrigatório'),
  filialId: z.string().min(1, 'Filial é obrigatória'),
  endereco: z.string().max(300).optional().default(''),
  cidade: z.string().max(100).optional().default(''),
  uf: z.string().length(2, 'UF deve ter 2 caracteres').optional().default(''),
  dataInicio: z.string().min(1, 'Data de início é obrigatória'),
  dataPrevisaoFim: z.string().min(1, 'Data de previsão de fim é obrigatória'),
  orcamentoPrevisto: z.number().min(0, 'Orçamento não pode ser negativo'),
});

export type ObraFormData = z.infer<typeof obraFormSchema>;
