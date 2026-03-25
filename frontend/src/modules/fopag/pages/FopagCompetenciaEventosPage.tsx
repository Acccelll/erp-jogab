import { useParams } from 'react-router-dom';
import { EmptyState, MainContent } from '@/shared/components';
import { FopagEventosTable } from '../components';
import { useFopagCompetenciaDetails } from '../hooks';

export function FopagCompetenciaEventosPage() {
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
          title="Erro ao carregar eventos"
          description="Não foi possível carregar os eventos da competência."
        />
      </MainContent>
    );
  }

  return (
    <MainContent className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-text-strong">Eventos</h2>
        <p className="text-sm text-text-muted">
          Detalhamento dos eventos da competência, incluindo origem em RH e Horas Extras.
        </p>
      </div>
      <FopagEventosTable items={detalhe.eventos} />
    </MainContent>
  );
}
