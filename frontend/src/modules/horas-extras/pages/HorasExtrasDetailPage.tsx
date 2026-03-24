import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, User, Building2, FileText } from 'lucide-react';
import { EmptyState, MainContent, PageHeader } from '@/shared/components';
import { useHoraExtraDetails } from '../hooks';
import { HORA_EXTRA_TIPO_LABELS, HORA_EXTRA_STATUS_LABELS, HORA_EXTRA_STATUS_VARIANTS } from '../types';
import type { HoraExtraStatus } from '../types';

function StatusBadgeInline({ status }: { status: HoraExtraStatus }) {
  const variant = HORA_EXTRA_STATUS_VARIANTS[status];
  const label = HORA_EXTRA_STATUS_LABELS[status];
  const colors: Record<string, string> = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${colors[variant] ?? colors.default}`}
    >
      {label}
    </span>
  );
}

function DetailField({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">{value ?? '—'}</dd>
    </div>
  );
}

export function HorasExtrasDetailPage() {
  const { lancamentoId } = useParams<{ lancamentoId: string }>();
  const { horaExtra, isLoading, isError, refetch } = useHoraExtraDetails(lancamentoId);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Detalhe do Lançamento"
        subtitle={horaExtra ? `${horaExtra.funcionarioNome} — ${horaExtra.obraNome}` : 'Carregando...'}
        actions={
          <Link
            to="/horas-extras/lancamentos"
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Voltar aos lançamentos
          </Link>
        }
      />

      <MainContent className="space-y-6">
        {isLoading && (
          <div className="flex flex-1 items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-jogab-500 border-t-transparent" />
              <p className="text-sm text-gray-500">Carregando lançamento...</p>
            </div>
          </div>
        )}

        {isError && (
          <EmptyState
            title="Erro ao carregar lançamento"
            description="Não foi possível carregar os dados deste lançamento de hora extra."
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

        {!isLoading && !isError && !horaExtra && (
          <EmptyState
            title="Lançamento não encontrado"
            description="O lançamento solicitado não existe ou foi removido."
            action={
              <Link
                to="/horas-extras/lancamentos"
                className="inline-flex items-center gap-1.5 rounded-md bg-jogab-500 px-3 py-1.5 text-sm text-white hover:bg-jogab-600"
              >
                Voltar aos lançamentos
              </Link>
            }
          />
        )}

        {!isLoading && !isError && horaExtra && (
          <>
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Informações gerais</h2>
                <StatusBadgeInline status={horaExtra.status} />
              </div>
              <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <DetailField label="Funcionário" value={horaExtra.funcionarioNome} />
                <DetailField label="Matrícula" value={horaExtra.matricula} />
                <DetailField label="Cargo" value={horaExtra.cargo} />
                <DetailField label="Obra" value={horaExtra.obraNome} />
                <DetailField label="Centro de Custo" value={horaExtra.centroCustoNome} />
                <DetailField label="Filial" value={horaExtra.filialNome} />
              </dl>
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Clock size={18} className="text-jogab-600" />
                <h2 className="text-lg font-semibold text-gray-900">Dados do lançamento</h2>
              </div>
              <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <DetailField label="Competência" value={horaExtra.competencia} />
                <DetailField label="Data do lançamento" value={horaExtra.dataLancamento} />
                <DetailField label="Tipo" value={HORA_EXTRA_TIPO_LABELS[horaExtra.tipo]} />
                <DetailField label="Quantidade de horas" value={`${horaExtra.quantidadeHoras.toFixed(1)}h`} />
                <DetailField
                  label="Valor calculado"
                  value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    horaExtra.valorCalculado,
                  )}
                />
                <DetailField label="Origem" value={horaExtra.origem} />
              </dl>
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <User size={18} className="text-jogab-600" />
                <h2 className="text-lg font-semibold text-gray-900">Aprovação</h2>
              </div>
              <dl className="grid gap-4 sm:grid-cols-2">
                <DetailField label="Status atual" value={HORA_EXTRA_STATUS_LABELS[horaExtra.status]} />
                <DetailField label="Aprovador" value={horaExtra.aprovadorNome ?? 'Sem aprovador definido'} />
              </dl>
            </section>

            {horaExtra.observacao && (
              <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <FileText size={18} className="text-jogab-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Justificativa / Observação</h2>
                </div>
                <p className="text-sm text-gray-700">{horaExtra.observacao}</p>
              </section>
            )}

            <section className="rounded-xl border border-dashed border-gray-300 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Building2 size={18} className="text-gray-400" />
                <h2 className="text-base font-semibold text-gray-900">Histórico de aprovação</h2>
              </div>
              <p className="text-sm text-gray-500">
                O histórico detalhado de aprovação será habilitado na integração com o backend.
              </p>
            </section>
          </>
        )}
      </MainContent>
    </div>
  );
}
