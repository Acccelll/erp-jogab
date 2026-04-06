import { MainContent, PageHeader } from '@/shared/components';
import { useSocialAlertas } from '../hooks';

export function SocialAlertasPage() {
  const { data } = useSocialAlertas();

  return (
    <div className="flex flex-1 flex-col bg-surface-secondary">
      <PageHeader title="Social · Alertas" subtitle="Monitoramento de risco operacional e performance por conta social." />
      <MainContent>
        <div className="space-y-3">
          {(data ?? []).map((alerta) => (
            <article key={alerta.id} className="rounded-lg border border-border-default bg-surface-card p-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-text-strong">{alerta.titulo}</h2>
                <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs uppercase text-text-muted">{alerta.severidade}</span>
              </div>
              <p className="mt-1 text-sm text-text-body">{alerta.descricao}</p>
              <p className="mt-2 text-xs text-text-muted">Referência: {alerta.data_referencia}</p>
            </article>
          ))}
        </div>
      </MainContent>
    </div>
  );
}
