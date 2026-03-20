import { FileSearch } from 'lucide-react';
import { ModulePlaceholder, PageHeader } from '@/shared/components';

export function DocumentoFiscalDetailPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Documento Fiscal"
        subtitle="Detalhe do documento fiscal com rastreabilidade, status, obra e integrações relacionadas."
      />
      <ModulePlaceholder
        icon={FileSearch}
        title="Detalhe do documento fiscal"
        description="Visualização consolidada do documento fiscal com dados de origem, histórico, vínculo com obra e desdobramentos operacionais."
        phase="Fase 6"
        features={[
          'Status e origem do lançamento',
          'Vínculo com obra, centro de custo e competência',
          'Histórico e rastreabilidade',
          'Integração com compras, estoque e financeiro',
          'Dados do documento e validações fiscais',
        ]}
      />
    </div>
  );
}
