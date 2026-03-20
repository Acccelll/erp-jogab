import { ShoppingCart } from 'lucide-react';
import { PageHeader, ModulePlaceholder } from '@/shared/components';

export function ComprasListPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Compras"
        subtitle="Solicitações e pedidos de compra"
      />
      <ModulePlaceholder
        icon={ShoppingCart}
        title="Compras"
        description="Gestão de solicitações e pedidos de compra vinculados a obras, com fluxo de aprovação, cotação e integração fiscal/financeira."
        phase="Fase 6"
        features={[
          'Solicitações de compra',
          'Pedidos de compra',
          'Cotações e aprovações',
          'Vinculação a obra e centro de custo',
          'Integração com fiscal e estoque',
        ]}
      />
    </div>
  );
}
