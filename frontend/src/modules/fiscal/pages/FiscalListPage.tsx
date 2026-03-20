import { FileText } from 'lucide-react';
import { PageHeader, ModulePlaceholder } from '@/shared/components';

export function FiscalListPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Fiscal"
        subtitle="Documentos fiscais e obrigações"
      />
      <ModulePlaceholder
        icon={FileText}
        title="Fiscal"
        description="Gestão de documentos fiscais: notas de entrada e saída vinculadas a compras, obras e financeiro."
        phase="Fase 6"
        features={[
          'Documentos fiscais de entrada',
          'Documentos fiscais de saída',
          'Vinculação a pedidos de compra',
          'Integração com estoque e financeiro',
          'Rastreabilidade por obra',
        ]}
      />
    </div>
  );
}
