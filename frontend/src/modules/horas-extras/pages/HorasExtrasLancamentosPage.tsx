import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowLeft } from 'lucide-react';
import { EmptyState, MainContent, PageHeader } from '@/shared/components';
import { useHorasExtras, useHorasExtrasFilters } from '../hooks';
import { HorasExtrasFilters } from '../components';
import type { HoraExtraListItem } from '../types';
import { HORA_EXTRA_TIPO_LABELS, HORA_EXTRA_STATUS_LABELS, HORA_EXTRA_STATUS_VARIANTS } from '../types';

function StatusBadgeInline({ status }: { status: HoraExtraListItem['status'] }) {
  const variant = HORA_EXTRA_STATUS_VARIANTS[status];
  const label = HORA_EXTRA_STATUS_LABELS[status];
  const colors: Record<string, string> = {
    default: 'bg-surface-soft text-text-body',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[variant] ?? colors.default}`}
    >
      {label}
    </span>
  );
}

export function HorasExtrasLancamentosPage() {
  const { filters, setSearch, setStatus, setTipo, setCompetencia, clearFilters, hasActiveFilters } =
    useHorasExtrasFilters();

  const { data, isLoading, isError, refetch } = useHorasExtras(filters);

  const items: HoraExtraListItem[] = useMemo(() => data?.data ?? [], [data?.data]);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Lançamentos de Horas Extras"
        subtitle="Visão consolidada de todos os lançamentos operacionais por competência, tipo e status."
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/horas-extras"
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-text-body transition-colors hover:bg-surface-soft"
            >
              <ArrowLeft size={16} />
              Voltar ao painel
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md bg-jogab-700 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-jogab-800"
            >
              <Plus size={16} />
              Novo lançamento
            </button>
          </div>
        }
      />

      <HorasExtrasFilters
        search={filters.search ?? ''}
        status={filters.status}
        tipo={filters.tipo}
        competencia={filters.competencia}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onTipoChange={setTipo}
        onCompetenciaChange={setCompetencia}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <MainContent className="space-y-6">
        {isLoading && (
          <div className="flex flex-1 items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-jogab-500 border-t-transparent" />
              <p className="text-sm text-text-muted">Carregando lançamentos...</p>
            </div>
          </div>
        )}

        {isError && (
          <EmptyState
            title="Erro ao carregar lançamentos"
            description="Não foi possível carregar os lançamentos de horas extras."
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

        {!isLoading && !isError && items.length === 0 && (
          <EmptyState
            title="Nenhum lançamento encontrado"
            description={
              hasActiveFilters
                ? 'Nenhum lançamento corresponde aos filtros selecionados.'
                : 'Cadastre o primeiro lançamento de horas extras para iniciar o processo operacional.'
            }
            action={
              hasActiveFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-text-body hover:bg-surface-soft"
                >
                  Limpar filtros
                </button>
              ) : undefined
            }
          />
        )}

        {!isLoading && !isError && items.length > 0 && (
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-text-strong">
                {items.length} lançamento{items.length !== 1 ? 's' : ''}
              </h2>
              <p className="text-sm text-text-muted">Lista completa dos lançamentos operacionais de horas extras.</p>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border-default">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-surface-soft">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                      Funcionário
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                      Obra
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                      Data
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                      Tipo
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-muted">
                      Horas
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-soft">
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-text-strong">
                        {item.funcionarioNome}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-text-muted">{item.obraNome}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-text-muted">{item.dataLancamento}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-text-muted">
                        {HORA_EXTRA_TIPO_LABELS[item.tipo]}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-text-strong">
                        {item.quantidadeHoras.toFixed(1)}h
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <StatusBadgeInline status={item.status} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <Link
                          to={`/horas-extras/${item.id}`}
                          className="font-medium text-jogab-700 hover:text-jogab-700"
                        >
                          Detalhes
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </MainContent>
    </div>
  );
}
