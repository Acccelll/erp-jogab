import { MainContent, PageHeader } from '@/shared/components';
import { HorasExtrasAprovacaoPlaceholder } from '../components';

export function HorasExtrasAprovacaoPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Aprovação de Horas Extras"
        subtitle="Área preparada para o fluxo de aprovação, histórico e posterior integração com o fechamento e a FOPAG."
      />
      <MainContent>
        <HorasExtrasAprovacaoPlaceholder />
      </MainContent>
    </div>
  );
}
