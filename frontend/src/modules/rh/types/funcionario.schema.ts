/**
 * Schemas Zod do módulo RH.
 *
 * Usados para validação de formulários (React Hook Form + Zod).
 */
import { z } from 'zod';

export const funcionarioStatusSchema = z.enum([
  'ativo',
  'afastado',
  'ferias',
  'desligado',
  'admissao_pendente',
]);

export const tipoContratoSchema = z.enum([
  'clt',
  'pj',
  'temporario',
  'estagio',
  'aprendiz',
]);

/** Schema para criação/edição de funcionário */
export const funcionarioFormSchema = z.object({
  matricula: z.string().min(1, 'Matrícula é obrigatória').max(20, 'Máximo 20 caracteres'),
  nome: z.string().min(1, 'Nome é obrigatório').max(200, 'Máximo 200 caracteres'),
  cpf: z.string().min(11, 'CPF deve ter 11 dígitos').max(14, 'CPF inválido'),
  status: funcionarioStatusSchema,
  tipoContrato: tipoContratoSchema,
  cargo: z.string().min(1, 'Cargo é obrigatório').max(100),
  funcao: z.string().min(1, 'Função é obrigatória').max(100),
  departamento: z.string().min(1, 'Departamento é obrigatório').max(100),
  filialId: z.string().min(1, 'Filial é obrigatória'),
  obraAlocadoId: z.string().optional().nullable(),
  centroCustoId: z.string().optional().nullable(),
  dataAdmissao: z.string().min(1, 'Data de admissão é obrigatória'),
  salarioBase: z.number().min(0, 'Salário não pode ser negativo'),
  email: z.string().email('E-mail inválido').optional().default(''),
  telefone: z.string().max(20).optional().default(''),
  cidade: z.string().max(100).optional().default(''),
  uf: z.string().length(2, 'UF deve ter 2 caracteres').optional().default(''),
  gestorId: z.string().optional().nullable(),
});

export type FuncionarioFormData = z.infer<typeof funcionarioFormSchema>;
