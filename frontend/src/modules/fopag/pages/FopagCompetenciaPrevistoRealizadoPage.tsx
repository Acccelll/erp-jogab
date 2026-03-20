import { useParams } from 'react-router-dom';
import { EmptyState, MainContent } from '@/shared/components';
import { FopagPrevistoRealizadoTable } from '../components';
import { useFopagCompetenciaDetails } from '../hooks';

export function FopagCompetenciaPrevistoRealizadoPage() {
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
          title="Erro ao carregar previsto x realizado"
          description="Não foi possível carregar o comparativo da competência."
        />
      </MainContent>
    );
  }

  return (
    <MainContent className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Previsto x Realizado</h2>
        <p className="text-sm text-gray-500">
          Comparativo da folha prevista com os valores efetivamente realizados e conciliados.
        </p>
      </div>
      <FopagPrevistoRealizadoTable items={detalhe.previstoRealizado} />
    </MainContent>
  );
}
