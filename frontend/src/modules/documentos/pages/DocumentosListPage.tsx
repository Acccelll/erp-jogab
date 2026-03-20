import { PageHeader } from '@/shared/components';

export function DocumentosListPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Documentos"
        subtitle="Gestão documental"
      />
      <div className="flex flex-1 items-center justify-center text-gray-400">
        Documentos — em desenvolvimento
      </div>
    </div>
  );
}
