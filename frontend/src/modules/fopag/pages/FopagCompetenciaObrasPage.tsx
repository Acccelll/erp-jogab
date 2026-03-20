import { useParams } from 'react-router-dom';
import { EmptyState, MainContent } from '@/shared/components';
import { FopagObrasTable } from '../components';
import { useFopagCompetenciaDetails } from '../hooks';

export function FopagCompetenciaObrasPage() {
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
          title="Erro ao carregar obras"
          description="Não foi possível carregar a visão da folha por obra."
        />
      </MainContent>
    );
  }

  return (
    <MainContent className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Por obra</h2>
        <p className="text-sm text-gray-500">
          Leitura da folha prevista por obra para apropriação de custo e integração com Financeiro.
        </p>
      </div>
      <FopagObrasTable items={detalhe.obras} />
    </MainContent>
  );
}
