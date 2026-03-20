import { PageHeader } from '@/shared/components';

export function EstoqueListPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Estoque"
        subtitle="Movimentações e saldos"
      />
      <div className="flex flex-1 items-center justify-center text-gray-400">
        Estoque — em desenvolvimento
      </div>
    </div>
  );
}
