import { Link } from 'react-router-dom';
import { RELATORIO_CATEGORIA_LABELS } from '../types';
import type { RelatorioCategoriaCardProps } from './types';

export function RelatorioCategoriaCard({ item }: RelatorioCategoriaCardProps) {
  return (
    <Link
      to={`/relatorios/${item.categoria}`}
      className="inline-flex items-center gap-1.5 rounded-full border border-border-default bg-surface-card px-3 py-1.5 text-sm transition-colors hover:bg-surface-soft"
    >
      <span className="font-medium text-text-body">{RELATORIO_CATEGORIA_LABELS[item.categoria]}</span>
      <span className="rounded-full bg-jogab-50 px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-jogab-700">
        {item.quantidade}
      </span>
    </Link>
  );
}
