import { LayoutDashboard } from 'lucide-react';
import { PageHeader } from '@/shared/components';
import { ModulePlaceholder } from '@/shared/components';

export function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral executiva do ERP"
      />
      <ModulePlaceholder
        icon={LayoutDashboard}
        title="Dashboard Executivo"
        description="Painel central com indicadores de desempenho, alertas de pendências e visão consolidada de obras, financeiro e operações."
        phase="Fase 3"
        features={[
          'KPIs consolidados por empresa e obra',
          'Gráficos de custos planejado × realizado',
          'Alertas de vencimentos e pendências',
          'Resumo de obras ativas',
          'Indicadores financeiros',
        ]}
      />
    </div>
  );
}
