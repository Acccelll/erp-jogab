import { z } from 'zod';

export const horaExtraTipoSchema = z.enum([
  'he_50',
  'he_100',
  'he_noturna',
  'adicional_noturno',
  'domingo',
  'feriado',
]);

export const horaExtraStatusSchema = z.enum([
  'digitada',
  'pendente_aprovacao',
  'aprovada',
  'rejeitada',
  'fechada_para_fopag',
  'enviada_para_fopag',
  'paga',
  'cancelada',
]);
