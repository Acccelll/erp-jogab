import { FolderOpen } from 'lucide-react';
import { PageHeader, ModulePlaceholder } from '@/shared/components';

export function DocumentosListPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Documentos"
        subtitle="Gestão documental"
      />
      <ModulePlaceholder
        icon={FolderOpen}
        title="Gestão Documental"
        description="Controle de documentos vinculados a obras, funcionários e entidades, com vencimentos e alertas."
        phase="Fase 8"
        features={[
          'Upload e vinculação de documentos',
          'Controle de vencimentos',
          'Categorização por tipo',
          'Vinculação a obra, funcionário e entidade',
          'Alertas de documentos a vencer',
        ]}
      />
    </div>
  );
}
