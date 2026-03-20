import { Building2 } from 'lucide-react';
import { PageHeader, ModulePlaceholder } from '@/shared/components';

export function ObraVisaoGeralPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Visão Geral da Obra"
        subtitle="Resumo e indicadores principais"
      />
      <ModulePlaceholder
        icon={Building2}
        title="Visão Geral da Obra"
        description="Dashboard da obra com resumo de custos, cronograma, equipe alocada e principais indicadores do projeto."
        phase="Fase 3"
        features={[
          'KPIs da obra (custo, prazo, equipe)',
          'Resumo de cronograma',
          'Distribuição de custos por categoria',
          'Alertas e pendências da obra',
          'Atalhos para abas do workspace',
        ]}
      />
    </div>
  );
}
