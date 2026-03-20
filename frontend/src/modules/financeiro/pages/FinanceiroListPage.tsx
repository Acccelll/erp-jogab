import { DollarSign } from 'lucide-react';
import { PageHeader, ModulePlaceholder } from '@/shared/components';

export function FinanceiroListPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Financeiro"
        subtitle="Títulos, previsões e realizados"
      />
      <ModulePlaceholder
        icon={DollarSign}
        title="Financeiro"
        description="Controle financeiro com títulos a pagar e receber, previsão de desembolso, conciliação e visão por obra."
        phase="Fase 7"
        features={[
          'Títulos a pagar e a receber',
          'Previsão de desembolso',
          'Planejado × comprometido × realizado',
          'Conciliação bancária',
          'Visão financeira por obra',
        ]}
      />
    </div>
  );
}
