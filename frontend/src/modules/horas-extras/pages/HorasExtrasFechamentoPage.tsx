import { useQuery } from '@tanstack/react-query';
import { CalendarCheck2, SendHorizonal } from 'lucide-react';
import { EmptyState, MainContent, PageHeader } from '@/shared/components';
import { fetchFechamentosCompetencia } from '../services/horasExtras.service';
import { HorasExtrasFechamentoCard } from '../components';

export function HorasExtrasFechamentoPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['horas-extras-fechamentos'],
    queryFn: fetchFechamentosCompetencia,
  });

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Fechamento de Horas Extras"
        subtitle="Consolidação por competência para envio futuro à FOPAG e reflexo financeiro por obra."
        actions={
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md bg-jogab-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-jogab-600"
          >
            <SendHorizonal size={16} />
            Fechar competência
          </button>
        }
      />

      <MainContent className="space-y-6">
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-jogab-50 text-jogab-600">
              <CalendarCheck2 size={20} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Visão de fechamento por competência</h2>
              <p className="mt-1 text-sm text-gray-500">
                Esta área prepara a etapa formal de fechamento, evidenciando pendências, totais e prontidão para integração com FOPAG.
              </p>
            </div>
          </div>
        </section>

        {isLoading && (
          <div className="flex flex-1 items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-jogab-500 border-t-transparent" />
              <p className="text-sm text-gray-500">Carregando fechamentos...</p>
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
                className="rounded-md bg-jogab-500 px-3 py-1.5 text-sm text-white hover:bg-jogab-600"
              >
                Tentar novamente
              </button>
            }
          />
        )}

        {!isLoading && !isError && data && (
          <>
            <section className="grid gap-4 xl:grid-cols-2">
              {data.map((fechamento) => (
                <HorasExtrasFechamentoCard key={fechamento.id} fechamento={fechamento} />
              ))}
            </section>

            <section className="rounded-xl border border-dashed border-gray-300 bg-white p-5 shadow-sm shadow-gray-100/60">
              <h2 className="text-base font-semibold text-gray-900">Ações visuais de fechamento</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <button type="button" className="rounded-lg border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Validar pendências de aprovação
                </button>
                <button type="button" className="rounded-lg border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Consolidar lançamentos da competência
                </button>
                <button type="button" className="rounded-lg border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50">
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
