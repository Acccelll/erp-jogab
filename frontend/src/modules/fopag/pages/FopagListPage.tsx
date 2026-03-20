import { PageHeader } from '@/shared/components';

export function FopagListPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="FOPAG"
        subtitle="Folha de pagamento por competência"
      />
      <div className="flex flex-1 items-center justify-center text-gray-400">
        FOPAG — em desenvolvimento
      </div>
    </div>
  );
}
