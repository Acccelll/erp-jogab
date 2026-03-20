import { User } from 'lucide-react';
import { PageHeader, ModulePlaceholder } from '@/shared/components';

export function PerfilPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Perfil"
        subtitle="Dados do usuário e preferências"
      />
      <ModulePlaceholder
        icon={User}
        title="Meu Perfil"
        description="Dados pessoais do usuário, preferências do sistema, alteração de senha e configurações de notificação."
        phase="Fase 8"
        features={[
          'Dados pessoais',
          'Alteração de senha',
          'Preferências de exibição',
          'Configurações de notificação',
          'Histórico de acessos',
        ]}
      />
    </div>
  );
}
