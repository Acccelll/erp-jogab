import { PageHeader } from '@/shared/components';

export function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral executiva do ERP"
      />
      <div className="flex flex-1 items-center justify-center text-gray-400">
        Dashboard — em desenvolvimento
      </div>
    </div>
  );
}
