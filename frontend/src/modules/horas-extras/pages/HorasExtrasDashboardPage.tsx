import { Clock } from 'lucide-react';
import { PageHeader, ModulePlaceholder } from '@/shared/components';

export function HorasExtrasDashboardPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Horas Extras"
        subtitle="Controle e aprovação de horas extras"
      />
      <ModulePlaceholder
        icon={Clock}
        title="Horas Extras"
        description="Controle completo de horas extras: lançamento, aprovação, fechamento por competência e integração com FOPAG e financeiro."
        phase="Fase 4"
        features={[
          'Dashboard de horas extras',
          'Lançamentos por funcionário e obra',
          'Fluxo de aprovação',
          'Fechamento por competência',
          'Tipos: HE 50%, 100%, noturna, domingo, feriado',
          'Integração FOPAG e custo da obra',
        ]}
      />
    </div>
  );
}
