/**
 * ObraVisaoGeralPage — Visão geral/dashboard da obra.
 *
 * Exibe KPIs, progresso e blocos de resumo por domínio
 * (financeiro, equipe, compras, medições, documentos, RH/FOPAG).
 *
 * Referência: docs/06-arquitetura-de-telas.md, CLAUDE.md "Padrão de tela"
 */
import { useParams } from 'react-router-dom';
import { DollarSign, TrendingUp, Wallet, Users, FileSignature, Clock, Target } from 'lucide-react';
import { MainContent } from '@/shared/components';
import { formatCurrency, cn } from '@/shared/lib/utils';
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
          <p className="text-sm text-text-muted">Carregando visão geral...</p>
        </div>
      </div>
    );
  }

  if (isError || !kpis) {
    return (
      <div className="flex flex-1 items-center justify-center py-12">
        <p className="text-sm text-text-muted">Erro ao carregar dados da obra.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <MainContent className="space-y-8 px-8 py-8">
        {/* KPIs da obra — dominant display */}
        <div className="flex flex-wrap items-end gap-x-12 gap-y-6">
          <div className="group">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted/40">
              Custo Realizado
            </span>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="text-4xl font-black tabular-nums tracking-tighter text-text-strong">
                {formatCurrency(kpis.custoRealizado)}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-surface-muted px-2 py-0.5 text-xs font-bold text-text-muted">
                {kpis.orcamentoPrevisto > 0 ? Math.round((kpis.custoRealizado / kpis.orcamentoPrevisto) * 100) : 0}%
              </span>
            </div>
          </div>

          <div className="h-10 w-px bg-border-default/30" />

          <div className="flex flex-wrap items-end gap-x-10">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted/50">Saldo</div>
              <div className={cn(
                "mt-0.5 text-xl font-bold tabular-nums",
                kpis.saldoDisponivel < 0 ? "text-danger" : "text-text-strong/90"
              )}>
                {formatCurrency(kpis.saldoDisponivel)}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted/50">Comprometido</div>
              <div className="mt-0.5 text-xl font-bold tabular-nums text-text-strong/90">
                {formatCurrency(kpis.custoComprometido)}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted/50">Prazo</div>
              <div className="mt-0.5 text-xl font-bold tabular-nums text-text-strong/90">
                {kpis.diasRestantes} <span className="text-xs font-medium text-text-muted">dias</span>
              </div>
            </div>
          </div>
        </div>
        {/* Progress horizontal strip — less heavy than a full block */}
        <div className="flex items-center gap-6 border-y border-border-default/30 py-4">
          <div className="flex items-center gap-3 min-w-[200px]">
            <Target size={18} className="text-brand-primary opacity-60" />
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-text-muted">
                <span>Progresso</span>
                <span>{kpis.percentualConcluido}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-surface-muted overflow-hidden">
                <div
                  className="h-full bg-brand-primary transition-all duration-700"
                  style={{ width: `${Math.min(kpis.percentualConcluido, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8 text-[11px] text-text-muted/80">
            <div className="flex items-center gap-2">
              <span className="font-bold text-text-strong">{kpis.totalFuncionarios}</span> funcionários
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-text-strong">{kpis.totalContratos}</span> contratos ativos
            </div>
          </div>
        </div>

        {/* Resumo por domínio — compact cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
    <div className="rounded-lg border border-border-default bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-jogab-50 text-jogab-700">
          {iconMap[bloco.titulo] ?? <Target size={16} />}
        </div>
        <h3 className="text-sm font-semibold text-text-strong">{bloco.titulo}</h3>
      </div>
      <ul className="space-y-2">
        {bloco.itens.map((item) => (
          <li key={item.label} className="flex items-center justify-between text-xs">
            <span className="text-text-muted">{item.label}</span>
            <span className={item.destaque ? 'font-semibold text-jogab-700' : 'font-medium text-text-body'}>
              {item.valor}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
