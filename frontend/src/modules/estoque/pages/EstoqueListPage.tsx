import { Package } from 'lucide-react';
import { PageHeader, ModulePlaceholder } from '@/shared/components';

export function EstoqueListPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Estoque"
        subtitle="Movimentações e saldos"
      />
      <ModulePlaceholder
        icon={Package}
        title="Estoque"
        description="Controle de estoque por obra e almoxarifado, com movimentações de entrada, saída, transferência e saldos."
        phase="Fase 7"
        features={[
          'Movimentações de estoque',
          'Saldos por material e obra',
          'Transferências entre obras',
          'Integração com compras e fiscal',
          'Rastreabilidade de origem',
        ]}
      />
    </div>
  );
}
