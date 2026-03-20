import { KPISection, KPICard } from '@/shared/components';
import { formatCurrency } from '@/shared/lib/utils';
import type { FopagCompetenciasKpis } from '../types';

interface FopagKpiBarProps {
  kpis: FopagCompetenciasKpis;
}

export function FopagKpiBar({ kpis }: FopagKpiBarProps) {
  return (
    <KPISection>
      <KPICard label="Competências" value={kpis.totalCompetencias} />
      <KPICard label="Em Consolidação" value={kpis.emConsolidacao} subtitle={kpis.emConsolidacao > 0 ? 'Dependem de fechamento' : 'Sem pendências'} trend={kpis.emConsolidacao > 0 ? 'down' : 'neutral'} />
      <KPICard label="Prontas para Rateio" value={kpis.prontasParaRateio} trend="up" />
      <KPICard label="Previsto" value={formatCurrency(kpis.valorPrevistoTotal)} trend="neutral" />
      <KPICard label="Realizado" value={formatCurrency(kpis.valorRealizadoTotal)} trend="neutral" />
    </KPISection>
  );
}
