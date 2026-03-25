import { useParams } from 'react-router-dom';
import { EmptyState, MainContent } from '@/shared/components';
import { FopagFuncionariosTable } from '../components';
import { useFopagCompetenciaDetails } from '../hooks';

export function FopagCompetenciaFuncionariosPage() {
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
          title="Erro ao carregar funcionários"
          description="Não foi possível carregar a visão por funcionário da competência."
        />
      </MainContent>
    );
  }

  return (
    <MainContent className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-text-strong">Por funcionário</h2>
        <p className="text-sm text-text-muted">
          Consolidação da competência por colaborador, incluindo reflexo de horas extras e benefícios.
        </p>
      </div>
      <FopagFuncionariosTable items={detalhe.funcionarios} />
    </MainContent>
  );
}
