import { Settings } from 'lucide-react';
import { PageHeader, ModulePlaceholder } from '@/shared/components';

export function AdminPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Administração"
        subtitle="Configurações e parâmetros do sistema"
      />
      <ModulePlaceholder
        icon={Settings}
        title="Administração"
        description="Configurações do sistema: usuários, permissões, parâmetros gerais, empresas, filiais e auditoria."
        phase="Fase 8"
        features={[
          'Gestão de usuários e permissões',
          'Parâmetros do sistema',
          'Cadastro de empresas e filiais',
          'Log de auditoria',
          'Configurações por módulo',
        ]}
      />
    </div>
  );
}
