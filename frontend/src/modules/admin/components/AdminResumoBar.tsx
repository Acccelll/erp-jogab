import type { AdminResumoExecutivo } from '../types';

export function AdminResumoBar({ resumo }: { resumo: AdminResumoExecutivo }) {
  const items = [
    ['Usuários', resumo.totalUsuarios],
    ['Perfis', resumo.totalPerfis],
    ['Permissões', resumo.totalPermissoes],
    ['Parâmetros ativos', resumo.parametrosAtivos],
    ['Logs recentes', resumo.logsRecentes],
    ['Integrações ativas', resumo.integracoesAtivas],
  ];
  return (
    <section className="grid gap-3 border-b border-border-light bg-surface-secondary px-6 py-4 md:grid-cols-2 xl:grid-cols-6">
      {items.map(([label, value]) => (
        <div
          key={label}
          className="rounded-xl border border-border-default bg-white px-4 py-3 shadow-sm shadow-gray-100/60"
        >
          <p className="text-xs uppercase tracking-wide text-text-subtle">{label}</p>
          <p className="mt-1 text-lg font-semibold text-text-strong">{String(value)}</p>
        </div>
      ))}
    </section>
  );
}
