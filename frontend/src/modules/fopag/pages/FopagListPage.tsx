import { Receipt } from 'lucide-react';
import { PageHeader, ModulePlaceholder } from '@/shared/components';

export function FopagListPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="FOPAG"
        subtitle="Folha de pagamento por competência"
      />
      <ModulePlaceholder
        icon={Receipt}
        title="FOPAG — Folha de Pagamento"
        description="Consolidação da previsão mensal da folha por competência, com visão por funcionário, por obra, eventos, rateio e comparação previsto × realizado."
        phase="Fase 5"
        features={[
          'Lista de competências',
          'Detalhe da competência com abas',
          'Visão por funcionário e por obra',
          'Eventos e rateio da folha',
          'Previsto × realizado',
          'Integração com financeiro',
        ]}
      />
    </div>
  );
}
