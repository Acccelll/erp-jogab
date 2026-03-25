import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import type { MedicoesCompetenciaResumo, MedicoesStatusResumo } from '../types';

interface MedicoesOverviewProps {
  statusItems: MedicoesStatusResumo[];
  competenciaItems: MedicoesCompetenciaResumo[];
}

export function MedicoesOverview({ statusItems, competenciaItems }: MedicoesOverviewProps) {
  return (
    <section className="grid gap-4 xl:grid-cols-2">
      <div className="rounded-xl border border-border-default bg-white p-5 shadow-sm shadow-gray-100/60">
        <h3 className="text-base font-semibold text-text-strong">Visão por status</h3>
        <div className="mt-4 space-y-3">
          {statusItems.map((item) => (
            <div key={item.status} className="rounded-lg border border-border-light bg-surface-soft px-3 py-2">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-text-body">{item.label}</p>
                <span className="text-sm text-text-muted">{item.quantidade} medição(ões)</span>
              </div>
              <p className="mt-1 text-sm text-text-muted">{item.descricao}</p>
              <p className="mt-2 text-sm font-semibold text-text-strong">{formatCurrency(item.valor)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border-default bg-white p-5 shadow-sm shadow-gray-100/60">
        <h3 className="text-base font-semibold text-text-strong">Visão por competência</h3>
        <div className="mt-4 space-y-3">
          {competenciaItems.map((item) => (
            <div key={item.competencia} className="rounded-lg border border-border-light bg-surface-soft px-3 py-2">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-text-body">{formatCompetencia(item.competencia)}</p>
                <span className="text-sm text-text-muted">{item.quantidade} medição(ões)</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-text-muted">
                <span>
                  Medido: <strong className="text-text-strong">{formatCurrency(item.valorMedido)}</strong>
                </span>
                <span>
                  Faturado: <strong className="text-text-strong">{formatCurrency(item.valorFaturado)}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
