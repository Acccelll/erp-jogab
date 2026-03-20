import { z } from 'zod';

export const fopagCompetenciaStatusSchema = z.enum([
  'aberta',
  'em_consolidacao',
  'pronta_para_rateio',
  'fechada_prevista',
  'conciliada',
]);

export const fopagEventoOrigemSchema = z.enum([
  'rh',
  'horas_extras',
  'beneficios',
  'provisoes',
  'ajuste_manual',
]);
