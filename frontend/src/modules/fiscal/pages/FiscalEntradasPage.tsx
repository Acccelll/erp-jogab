import { ArrowDownToLine } from 'lucide-react';
import { ModulePlaceholder, PageHeader } from '@/shared/components';

export function FiscalEntradasPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Fiscal · Entradas"
        subtitle="Documentos fiscais de entrada vinculados a compras, obras e integração com estoque e financeiro."
      />
      <ModulePlaceholder
        icon={ArrowDownToLine}
        title="Entradas fiscais"
        description="Recebimento e conferência de notas fiscais de entrada com rastreabilidade por obra, fornecedor e pedido de compra."
        phase="Fase 6"
        features={[
          'Notas fiscais de entrada',
          'Vinculação com pedidos de compra',
          'Conferência fiscal e documental',
          'Integração com estoque',
          'Rastreabilidade por obra e centro de custo',
        ]}
      />
    </div>
  );
}
