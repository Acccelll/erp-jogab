import { useParams } from 'react-router-dom';
import { EmptyState, MainContent } from '@/shared/components';
import { FopagFinanceiroCard, FopagResumoCard } from '../components';
import { useFopagCompetenciaDetails } from '../hooks';

export function FopagCompetenciaOverviewPage() {
  const { competenciaId } = useParams<{ competenciaId: string }>();
  const { detalhe, isLoading, isError } = useFopagCompetenciaDetails(competenciaId);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-jogab-500 border-t-transparent" />
      </div>
    );
  }

  if (isError || !detalhe) {
    return (
      <MainContent>
        <EmptyState
          title="Erro ao carregar competência"
          description="Não foi possível carregar a visão geral da competência selecionada."
        />
      </MainContent>
    );
  }

  return (
    <MainContent className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-3">
        {detalhe.resumoCards.map((card) => (
          <FopagResumoCard key={card.id} card={card} />
        ))}
      </section>
      <FopagFinanceiroCard financeiro={detalhe.financeiro} />
    </MainContent>
  );
}
