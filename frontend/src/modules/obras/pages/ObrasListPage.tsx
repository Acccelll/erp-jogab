import { PageHeader } from '@/shared/components';

export function ObrasListPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Obras"
        subtitle="Gestão de obras e projetos"
      />
      <div className="flex flex-1 items-center justify-center text-gray-400">
        Lista de Obras — em desenvolvimento
      </div>
    </div>
  );
}
