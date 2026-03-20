/**
 * ObraVisaoGeralPage — Visão geral/dashboard da obra.
 *
 * Exibe KPIs, progresso e blocos de resumo por domínio
 * (financeiro, equipe, compras, medições, documentos, RH/FOPAG).
 *
 * Referência: docs/06-arquitetura-de-telas.md, CLAUDE.md "Padrão de tela"
 */
import { useParams } from 'react-router-dom';
import {
  DollarSign,
  TrendingUp,
  Wallet,
  Users,
  FileSignature,
  Clock,
  Target,
} from 'lucide-react';
import { KPISection, KPICard, MainContent } from '@/shared/components';
import { formatCurrency } from '@/shared/lib/utils';
import { useObraDetails } from '../hooks/useObraDetails';
import type { ObraResumoBloco } from '../types';

export function ObraVisaoGeralPage() {
  const { obraId } = useParams<{ obraId: string }>();
  const { kpis, resumoBlocos, isLoading, isError } = useObraDetails(obraId);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-jogab-500 border-t-transparent" />
          <p className="text-sm text-gray-500">Carregando visão geral...</p>
        </div>
      </div>
    );
  }

  if (isError || !kpis) {
    return (
      <div className="flex flex-1 items-center justify-center py-12">
        <p className="text-sm text-gray-500">Erro ao carregar dados da obra.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* KPIs da obra */}
      <KPISection>
        <KPICard
          label="Orçamento Previsto"
          value={formatCurrency(kpis.orcamentoPrevisto)}
        />
        <KPICard
          label="Custo Realizado"
          value={formatCurrency(kpis.custoRealizado)}
          subtitle={`${kpis.orcamentoPrevisto > 0 ? Math.round((kpis.custoRealizado / kpis.orcamentoPrevisto) * 100) : 0}% do orçamento`}
          trend={kpis.custoRealizado > kpis.orcamentoPrevisto * 0.8 ? 'down' : 'neutral'}
        />
        <KPICard
          label="Comprometido"
          value={formatCurrency(kpis.custoComprometido)}
          trend="neutral"
        />
        <KPICard
          label="Saldo Disponível"
          value={formatCurrency(kpis.saldoDisponivel)}
          subtitle={kpis.saldoDisponivel < 0 ? 'Orçamento estourado!' : undefined}
          trend={kpis.saldoDisponivel < 0 ? 'down' : 'up'}
        />
        <KPICard
          label="Dias Restantes"
          value={kpis.diasRestantes}
          subtitle={kpis.diasRestantes < 30 ? 'Prazo próximo' : undefined}
          trend={kpis.diasRestantes < 30 ? 'down' : 'neutral'}
        />
      </KPISection>

      <MainContent>
        {/* Progress bar large */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-jogab-500" />
              <span className="text-sm font-medium text-gray-700">Progresso da Obra</span>
            </div>
            <span className="text-lg font-bold text-jogab-600">{kpis.percentualConcluido}%</span>
          </div>
          <div className="h-3 w-full rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-jogab-500 transition-all"
              style={{ width: `${Math.min(kpis.percentualConcluido, 100)}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-400">
            <span>{kpis.totalFuncionarios} funcionários alocados</span>
            <span>{kpis.totalContratos} contratos ativos</span>
          </div>
        </div>

        {/* Resumo por domínio — blocos */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resumoBlocos.map((bloco) => (
            <ResumoBlocoCard key={bloco.titulo} bloco={bloco} />
          ))}
        </div>
      </MainContent>
    </div>
  );
}

/** Card de bloco de resumo (financeiro, equipe, compras, etc.) */
function ResumoBlocoCard({ bloco }: { bloco: ObraResumoBloco }) {
  const iconMap: Record<string, React.ReactNode> = {
    Financeiro: <DollarSign size={16} />,
    Equipe: <Users size={16} />,
    Compras: <TrendingUp size={16} />,
    Medições: <Wallet size={16} />,
    Documentos: <FileSignature size={16} />,
    'RH / FOPAG': <Clock size={16} />,
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-jogab-50 text-jogab-600">
          {iconMap[bloco.titulo] ?? <Target size={16} />}
        </div>
        <h3 className="text-sm font-semibold text-gray-900">{bloco.titulo}</h3>
      </div>
      <ul className="space-y-2">
        {bloco.itens.map((item) => (
          <li key={item.label} className="flex items-center justify-between text-xs">
            <span className="text-gray-500">{item.label}</span>
            <span className={item.destaque ? 'font-semibold text-jogab-600' : 'font-medium text-gray-700'}>
              {item.valor}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
