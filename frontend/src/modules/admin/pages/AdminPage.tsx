import { PageHeader } from '@/shared/components';

export function AdminPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Administração"
        subtitle="Configurações e parâmetros do sistema"
      />
      <div className="flex flex-1 items-center justify-center text-gray-400">
        Administração — em desenvolvimento
      </div>
    </div>
  );
}
