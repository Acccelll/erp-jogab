import type { DocumentosKpis } from '../types';

interface DocumentosKpiBarProps {
  kpis: DocumentosKpis;
}

export function DocumentosKpiBar({ kpis }: DocumentosKpiBarProps) {
  const items = [
    { label: 'Documentos', value: String(kpis.totalDocumentos) },
    { label: 'Vigentes', value: String(kpis.vigentes) },
    { label: 'A vencer', value: String(kpis.aVencer) },
    { label: 'Vencidos', value: String(kpis.vencidos) },
    { label: 'Entidades', value: String(kpis.entidadesCobertas) },
    { label: 'Alertas críticos', value: String(kpis.alertasCriticos) },
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
