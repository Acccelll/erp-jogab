/**
 * FuncionarioKpiBar — seção de KPIs da listagem de funcionários.
 * Usa os componentes compartilhados KPISection e KPICard.
 */
import { KPISection, KPICard } from '@/shared/components';
import { formatCurrency } from '@/shared/lib/utils';
import type { FuncionariosKpis } from '../types';

interface FuncionarioKpiBarProps {
  kpis: FuncionariosKpis;
}

export function FuncionarioKpiBar({ kpis }: FuncionarioKpiBarProps) {
  return (
    <KPISection>
      <KPICard
        label="Total de Funcionários"
        value={kpis.totalFuncionarios}
      />
      <KPICard
        label="Ativos"
        value={kpis.ativos}
        subtitle={`${kpis.totalFuncionarios > 0 ? Math.round((kpis.ativos / kpis.totalFuncionarios) * 100) : 0}% do total`}
        trend="neutral"
      />
      <KPICard
        label="Afastados"
        value={kpis.afastados}
        subtitle={kpis.afastados > 0 ? 'Atenção' : 'Nenhum'}
        trend={kpis.afastados > 0 ? 'down' : 'neutral'}
      />
      <KPICard
        label="Em Férias"
        value={kpis.ferias}
        trend="neutral"
      />
      <KPICard
        label="Custo Folha Estimado"
        value={formatCurrency(kpis.custoFolhaEstimado)}
        subtitle="Ativos — salário base"
        trend="neutral"
      />
    </KPISection>
  );
}
