/**
 * ObraKpiBar — seção de KPIs da listagem ou visão geral de obras.
 * Usa os componentes compartilhados KPISection e KPICard.
 */
import { KPISection, KPICard } from '@/shared/components';
import { formatCurrency } from '@/shared/lib/utils';
import type { ObrasKpis } from '../types';

interface ObraKpiBarProps {
  kpis: ObrasKpis;
}

export function ObraKpiBar({ kpis }: ObraKpiBarProps) {
  const percentualExecucao = kpis.orcamentoTotal > 0
    ? Math.round((kpis.custoRealizadoTotal / kpis.orcamentoTotal) * 100)
    : 0;

  return (
    <KPISection>
      <KPICard
        label="Total de Obras"
        value={kpis.totalObras}
      />
      <KPICard
        label="Em Andamento"
        value={kpis.obrasAtivas}
        subtitle={`${kpis.totalObras > 0 ? Math.round((kpis.obrasAtivas / kpis.totalObras) * 100) : 0}% do total`}
        trend="neutral"
      />
      <KPICard
        label="Concluídas"
        value={kpis.obrasConcluidas}
        trend="up"
      />
      <KPICard
        label="Paralisadas"
        value={kpis.obrasParalisadas}
        subtitle={kpis.obrasParalisadas > 0 ? 'Atenção necessária' : 'Nenhuma'}
        trend={kpis.obrasParalisadas > 0 ? 'down' : 'neutral'}
      />
      <KPICard
        label="Orçamento Total"
        value={formatCurrency(kpis.orcamentoTotal)}
        subtitle={`${percentualExecucao}% executado`}
        trend="neutral"
      />
    </KPISection>
  );
}
