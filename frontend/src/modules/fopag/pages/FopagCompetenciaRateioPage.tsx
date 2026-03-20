import { useParams } from 'react-router-dom';
import { EmptyState, MainContent } from '@/shared/components';
import { FopagRateioTable } from '../components';
import { useFopagCompetenciaDetails } from '../hooks';

export function FopagCompetenciaRateioPage() {
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
          title="Erro ao carregar rateio"
          description="Não foi possível carregar os rateios da competência."
        />
      </MainContent>
    );
  }

  return (
    <MainContent className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Rateio</h2>
        <p className="text-sm text-gray-500">
          Preparação do rateio da folha por centro de custo e obra para apropriação contábil e financeira.
        </p>
      </div>
      <FopagRateioTable items={detalhe.rateios} />
    </MainContent>
  );
}
