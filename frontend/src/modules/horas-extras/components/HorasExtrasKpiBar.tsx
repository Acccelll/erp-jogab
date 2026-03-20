import { KPISection, KPICard } from '@/shared/components';
import { formatCurrency } from '@/shared/lib/utils';
import type { HorasExtrasKpis } from '../types';

interface HorasExtrasKpiBarProps {
  kpis: HorasExtrasKpis;
}

export function HorasExtrasKpiBar({ kpis }: HorasExtrasKpiBarProps) {
  return (
    <KPISection>
      <KPICard label="Lançamentos" value={kpis.totalLancamentos} />
      <KPICard
        label="Pendentes de Aprovação"
        value={kpis.pendentesAprovacao}
        subtitle={kpis.pendentesAprovacao > 0 ? 'Demandam ação do gestor' : 'Sem pendências'}
        trend={kpis.pendentesAprovacao > 0 ? 'down' : 'neutral'}
      />
      <KPICard label="Aprovadas" value={kpis.aprovadas} trend="up" />
      <KPICard label="Fechadas para FOPAG" value={kpis.fechadasParaFopag} subtitle="Preparadas para integração" trend="neutral" />
      <KPICard label="Valor Total" value={formatCurrency(kpis.valorTotal)} subtitle={`${kpis.horasTotais.toFixed(1)} h lançadas`} trend="neutral" />
    </KPISection>
  );
}
