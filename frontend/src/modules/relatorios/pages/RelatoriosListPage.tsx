import { BarChart3 } from 'lucide-react';
import { PageHeader, ModulePlaceholder } from '@/shared/components';

export function RelatoriosListPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Relatórios"
        subtitle="Relatórios gerenciais e operacionais"
      />
      <ModulePlaceholder
        icon={BarChart3}
        title="Relatórios"
        description="Relatórios gerenciais e operacionais com visão por obra, módulo e período. Exportação em PDF e Excel."
        phase="Fase 8"
        features={[
          'Relatórios por obra',
          'Relatórios financeiros consolidados',
          'Relatórios de RH e folha',
          'Exportação PDF e Excel',
          'Filtros por período e competência',
        ]}
      />
    </div>
  );
}
