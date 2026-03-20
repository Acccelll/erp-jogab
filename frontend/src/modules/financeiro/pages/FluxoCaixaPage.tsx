import { AlertTriangle, Landmark } from 'lucide-react';
import { ContextBar, EmptyState, MainContent, PageHeader, StatusBadge } from '@/shared/components';
import { formatCurrency } from '@/shared/lib/utils';
import { FLUXO_CAIXA_STATUS_LABELS } from '../types';
import { useFinanceiroFilters, useFluxoCaixa } from '../hooks';
import { FinanceiroFilters } from '../components';

export function FluxoCaixaPage() {
  const {
    filters,
    setSearch,
    setStatus,
    setTipo,
    setOrigem,
    setCompetencia,
    clearFilters,
    hasActiveFilters,
  } = useFinanceiroFilters();

  const { data, isLoading, isError, refetch } = useFluxoCaixa(filters);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Financeiro · Fluxo de caixa"
        subtitle="Projeção de entradas e saídas conectando programação financeira, faturamento, compras e folha."
      />
      <ContextBar />
      <FinanceiroFilters
        search={filters.search ?? ''}
        status={filters.status}
        tipo={filters.tipo}
        origem={filters.origem}
        competencia={filters.competencia}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onTipoChange={setTipo}
        onOrigemChange={setOrigem}
        onCompetenciaChange={setCompetencia}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />
      <MainContent>
        {isLoading && <p className="text-sm text-gray-500">Carregando fluxo de caixa...</p>}
        {isError && (
          <EmptyState
            icon={<AlertTriangle size={28} />}
            title="Erro ao carregar fluxo de caixa"
            description="Não foi possível consolidar a agenda de entradas e saídas previstas."
            action={<button type="button" onClick={() => void refetch()} className="rounded-md bg-jogab-500 px-3 py-1.5 text-sm text-white">Tentar novamente</button>}
          />
        )}
        {!isLoading && !isError && (
          <div className="space-y-4">
            <div className="rounded-xl border border-jogab-100 bg-jogab-50/70 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-jogab-600">
                  <Landmark size={18} />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Leitura conceitual do caixa</h2>
                  <p className="text-sm text-gray-600">
                    O fluxo de caixa conecta saídas de FOPAG, Compras e Fiscal com entradas originadas em Medições e faturamento, sempre vinculadas à obra e à competência.
                  </p>
                </div>
              </div>
            </div>

            {!data || data.length === 0 ? (
              <EmptyState
                title="Nenhum evento de caixa encontrado"
                description="Ajuste a competência ou limpe os filtros para visualizar a agenda financeira projetada."
              />
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm shadow-gray-100/60">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Período</th>
                        <th className="px-4 py-3 text-right font-semibold text-gray-600">Previsto entrada</th>
                        <th className="px-4 py-3 text-right font-semibold text-gray-600">Previsto saída</th>
                        <th className="px-4 py-3 text-right font-semibold text-gray-600">Realizado entrada</th>
                        <th className="px-4 py-3 text-right font-semibold text-gray-600">Realizado saída</th>
                        <th className="px-4 py-3 text-right font-semibold text-gray-600">Saldo projetado</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {data.map((item) => (
                        <tr key={item.periodo} className="hover:bg-gray-50/70">
                          <td className="px-4 py-3 font-medium text-gray-900">{new Date(item.periodo).toLocaleDateString('pt-BR')}</td>
                          <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(item.previstoEntrada)}</td>
                          <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(item.previstoSaida)}</td>
                          <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(item.realizadoEntrada)}</td>
                          <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(item.realizadoSaida)}</td>
                          <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatCurrency(item.saldoProjetado)}</td>
                          <td className="px-4 py-3">
                            <StatusBadge
                              label={FLUXO_CAIXA_STATUS_LABELS[item.status]}
                              variant={item.status === 'superavit' ? 'success' : item.status === 'equilibrio' ? 'info' : 'warning'}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </MainContent>
    </div>
  );
}
