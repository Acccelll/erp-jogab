import { formatCurrency } from '@/shared/lib/utils';
import type { ComprasKpis } from '../types';

interface ComprasKpiBarProps {
  kpis: ComprasKpis;
}

export function ComprasKpiBar({ kpis }: ComprasKpiBarProps) {
  const items = [
    { label: 'Solicitações', value: String(kpis.totalSolicitacoes) },
    { label: 'Pendentes aprovação', value: String(kpis.solicitacoesPendentes) },
    { label: 'Cotações abertas', value: String(kpis.cotacoesEmAberto) },
    { label: 'Pedidos ativos', value: String(kpis.pedidosEmitidos) },
    { label: 'Comprometido', value: formatCurrency(kpis.valorComprometido) },
    { label: 'Aguardando fiscal', value: formatCurrency(kpis.valorAguardandoFiscal) },
  ];

  return (
    <section className="grid gap-3 border-b border-border-light bg-surface-secondary px-6 py-4 md:grid-cols-2 xl:grid-cols-6">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-border-default bg-white px-4 py-3 shadow-sm shadow-gray-100/60"
        >
          <p className="text-xs uppercase tracking-wide text-text-subtle">{item.label}</p>
          <p className="mt-1 text-lg font-semibold text-text-strong">{item.value}</p>
        </div>
      ))}
    </section>
  );
}
