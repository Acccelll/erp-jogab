import { Clock3, FileDown, LayoutDashboard, Repeat2 } from 'lucide-react';
import { RELATORIO_DISPONIBILIDADE_LABELS, RELATORIO_FORMATO_LABELS } from '../types';
import type { RelatorioSaidaOperacional } from '../types';

interface RelatorioSaidaCardProps {
  item: RelatorioSaidaOperacional;
}

function getDisponibilidadeClass(disponibilidade: RelatorioSaidaOperacional['disponibilidade']) {
  if (disponibilidade === 'disponivel') {
    return 'bg-emerald-50 text-emerald-700';
  }

  if (disponibilidade === 'em_preparacao') {
    return 'bg-amber-50 text-amber-700';
  }

  return 'bg-gray-100 text-gray-700';
}

export function RelatorioSaidaCard({ item }: RelatorioSaidaCardProps) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">{item.titulo}</h3>
          <p className="mt-1 text-sm text-gray-500">{item.descricao}</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${getDisponibilidadeClass(item.disponibilidade)}`}>
          {RELATORIO_DISPONIBILIDADE_LABELS[item.disponibilidade]}
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg bg-gray-50 p-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
            <LayoutDashboard size={14} />
            Saída principal
          </div>
          <p className="mt-1 text-sm text-gray-600">
            {RELATORIO_FORMATO_LABELS[item.formatoPrincipal]} · {item.destinoPadrao}
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
            <Clock3 size={14} />
            Tempo estimado
          </div>
          <p className="mt-1 text-sm text-gray-600">{item.tempoEstimado}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-jogab-50 px-2.5 py-1 text-xs font-medium text-jogab-700">
          <FileDown size={12} />
          {RELATORIO_FORMATO_LABELS[item.formatoPrincipal]}
        </span>
        {item.formatosSecundarios.map((formato) => (
          <span key={formato} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
            {RELATORIO_FORMATO_LABELS[formato]}
          </span>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-dashed border-gray-200 p-3">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
          <Repeat2 size={14} />
          Operação sugerida
        </div>
        <p className="mt-1 text-sm text-gray-600">{item.agendamento}</p>
      </div>
    </article>
  );
}
