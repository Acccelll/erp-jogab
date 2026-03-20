import { Building2 } from 'lucide-react';
import { PageHeader } from '@/shared/components';
import { ModulePlaceholder } from '@/shared/components';

export function ObrasListPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Obras"
        subtitle="Gestão de obras e projetos"
      />
      <ModulePlaceholder
        icon={Building2}
        title="Gestão de Obras"
        description="Núcleo central do ERP. Cada obra funciona como workspace com visão integrada de custos, equipe, compras, financeiro, medições e documentos."
        phase="Fase 3"
        features={[
          'Listagem e cadastro de obras',
          'Workspace por obra com 11 abas',
          'Cronograma e contratos',
          'Visão consolidada de custos',
          'Indicadores por obra',
        ]}
      />
    </div>
  );
}
