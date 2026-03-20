import { PageHeader } from '@/shared/components';

export function PerfilPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Perfil"
        subtitle="Dados do usuário e preferências"
      />
      <div className="flex flex-1 items-center justify-center text-gray-400">
        Perfil — em desenvolvimento
      </div>
    </div>
  );
}
