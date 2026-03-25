import type { RelatoriosResumoExecutivo } from '../types';

interface RelatoriosResumoBarProps {
  resumo: RelatoriosResumoExecutivo;
}

export function RelatoriosResumoBar({ resumo }: RelatoriosResumoBarProps) {
  const items = [
    { label: 'Relatórios', value: String(resumo.totalRelatorios) },
    { label: 'Categorias ativas', value: String(resumo.categoriasAtivas) },
    { label: 'Disponíveis', value: String(resumo.disponiveis) },
    { label: 'Planejados', value: String(resumo.planejados) },
    { label: 'Exportáveis', value: String(resumo.exportaveis) },
  ];

  return (
    <section className="grid gap-3 border-b border-border-light bg-surface-secondary px-6 py-3 md:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg border border-border-default bg-surface px-4 py-2.5 shadow-card">
          <p className="text-xs uppercase tracking-wide text-text-subtle">{item.label}</p>
          <p className="mt-0.5 text-lg font-semibold text-text-strong">{item.value}</p>
        </div>
      ))}
    </section>
  );
}
