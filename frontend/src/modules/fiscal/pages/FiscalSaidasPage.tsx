import { ArrowUpFromLine } from 'lucide-react';
import { ModulePlaceholder, PageHeader } from '@/shared/components';

export function FiscalSaidasPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Fiscal · Saídas"
        subtitle="Documentos fiscais de saída com controle por obra, faturamento e reflexos financeiros."
      />
      <ModulePlaceholder
        icon={ArrowUpFromLine}
        title="Saídas fiscais"
        description="Emissão e acompanhamento de documentos fiscais de saída conectados ao faturamento, contratos e obra de origem."
        phase="Fase 6"
        features={[
          'Notas fiscais de saída',
          'Integração com medições e faturamento',
          'Acompanhamento por contrato e obra',
          'Reflexos no financeiro',
          'Rastreabilidade de emissão e status',
        ]}
      />
    </div>
  );
}
