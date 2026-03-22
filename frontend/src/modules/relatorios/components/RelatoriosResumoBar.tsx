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
    <section className="grid gap-3 border-b border-border-light bg-surface-secondary px-6 py-4 md:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm shadow-gray-100/60">
          <p className="text-xs uppercase tracking-wide text-gray-400">{item.label}</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">{item.value}</p>
        </div>
      ))}
    </section>
  );
}
