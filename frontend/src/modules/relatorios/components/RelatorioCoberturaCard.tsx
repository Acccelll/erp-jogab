import { Database, Layers3 } from 'lucide-react';
import type { RelatorioCoberturaModulo } from '../types';

interface RelatorioCoberturaCardProps {
  item: RelatorioCoberturaModulo;
}

function getStatusStyles(status: RelatorioCoberturaModulo['status']) {
  if (status === 'coberto') {
    return 'bg-emerald-50 text-emerald-700';
  }

  if (status === 'parcial') {
    return 'bg-amber-50 text-amber-700';
  }

  return 'bg-gray-100 text-gray-700';
}

export function RelatorioCoberturaCard({ item }: RelatorioCoberturaCardProps) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm shadow-gray-100/60">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Layers3 size={14} />
            {item.modulo}
          </div>
          <p className="mt-1 text-sm text-gray-500">{item.descricao}</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyles(item.status)}`}>
          {item.status}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
        <Database size={14} />
        {item.quantidadeRelatorios} relatório(s) consumindo dados deste módulo.
      </div>
    </article>
  );
}
