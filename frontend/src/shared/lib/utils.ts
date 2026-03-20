import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Combina classes CSS com suporte a Tailwind merge */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formata competência YYYY-MM para exibição MM/YYYY */
export function formatCompetencia(competencia: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(competencia);
  if (!match) {
    return competencia;
  }
  return `${match[2]}/${match[1]}`;
}

/** Formata valor monetário em BRL */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}
