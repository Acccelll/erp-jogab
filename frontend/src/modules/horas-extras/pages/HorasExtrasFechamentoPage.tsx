import { useQuery } from '@tanstack/react-query';
import { CalendarCheck2, SendHorizonal, CheckCircle2, AlertCircle } from 'lucide-react';
import { EmptyState, MainContent, PageHeader } from '@/shared/components';
import { fetchFechamentosCompetencia } from '../services/horasExtras.service';
import { useFecharCompetenciaHorasExtras } from '../hooks';
import { HorasExtrasFechamentoCard } from '../components';

export function HorasExtrasFechamentoPage() {
  const fecharCompetenciaMutation = useFecharCompetenciaHorasExtras();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['horas-extras-fechamentos'],
    queryFn: fetchFechamentosCompetencia,
  });

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Fechamento de Horas Extras"
        subtitle="Consolidação por competência para envio futuro à FOPAG e reflexo financeiro por obra."
      />

      <MainContent className="space-y-6">
        <section className="rounded-xl border border-border-default bg-white p-5 shadow-sm shadow-gray-100/60">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-jogab-50 text-jogab-700">
              <CalendarCheck2 size={20} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-text-strong">Visão de fechamento por competência</h2>
              <p className="mt-1 text-sm text-text-muted">
                Esta área prepara a etapa formal de fechamento, evidenciando pendências, totais e prontidão para
                integração com FOPAG.
              </p>
            </div>
          </div>
        </section>

        {isLoading && (
          <div className="flex flex-1 items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-jogab-500 border-t-transparent" />
              <p className="text-sm text-text-muted">Carregando fechamentos...</p>
            </div>
          </div>
        )}

        {isError && (
          <EmptyState
            title="Erro ao carregar fechamentos"
            description="Não foi possível carregar a visão por competência do módulo Horas Extras."
            action={
              <button
                type="button"
                onClick={() => void refetch()}
                className="rounded-md bg-jogab-700 px-3 py-1.5 text-sm text-white hover:bg-jogab-800"
              >
                Tentar novamente
              </button>
            }
          />
        )}

        {!isLoading && !isError && data && (
          <>
            <section className="grid gap-4 xl:grid-cols-2">
              {data.length === 0 && (
                <div className="col-span-full">
                  <EmptyState
                    title="Nenhum fechamento processado"
                    description="Não existem competências com lançamentos para exibir nesta visão."
                  />
                </div>
              )}
              {data.map((fechamento) => (
                <HorasExtrasFechamentoCard
                  key={fechamento.id}
                  fechamento={fechamento}
                  onClose={(competencia) => void fecharCompetenciaMutation.mutateAsync(competencia)}
                  isClosing={
                    fecharCompetenciaMutation.isPending &&
                    fecharCompetenciaMutation.variables === fechamento.competencia
                  }
                />
              ))}
            </section>

            <section className="rounded-xl border border-dashed border-gray-300 bg-white p-5 shadow-sm shadow-gray-100/60">
              <h2 className="text-base font-semibold text-text-strong">Ações visuais de fechamento</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <button
                  type="button"
                  className="rounded-lg border border-gray-300 px-4 py-3 text-left text-sm font-medium text-text-body hover:bg-surface-soft"
                >
                  Validar pendências de aprovação
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-gray-300 px-4 py-3 text-left text-sm font-medium text-text-body hover:bg-surface-soft"
                >
                  Consolidar lançamentos da competência
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-gray-300 px-4 py-3 text-left text-sm font-medium text-text-body hover:bg-surface-soft"
                >
                  Preparar envio para FOPAG
                </button>
              </div>
            </section>
          </>
        )}
      </MainContent>
    </div>
  );
}
