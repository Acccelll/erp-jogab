import { Ruler } from 'lucide-react';
import { PageHeader, ModulePlaceholder } from '@/shared/components';

export function MedicoesListPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Medições e Faturamento"
        subtitle="Controle de medições e faturamento"
      />
      <ModulePlaceholder
        icon={Ruler}
        title="Medições e Faturamento"
        description="Controle de medições de obras e faturamento, com integração financeira e rastreabilidade por contrato."
        phase="Fase 7"
        features={[
          'Medições por obra e contrato',
          'Faturamento vinculado',
          'Integração com financeiro',
          'Histórico de medições',
          'Comparativo medido × contratado',
        ]}
      />
    </div>
  );
}
