import { MainContent, PageHeader } from '@/shared/components';
import { useSocialSnapshots } from '../hooks';

export function SocialMetricasPage() {
  const { data } = useSocialSnapshots();

  return (
    <div className="flex flex-1 flex-col bg-surface-secondary">
      <PageHeader title="Social · Métricas gerais" subtitle="Histórico persistido de snapshots por período e conta." />
      <MainContent>
        <div className="overflow-x-auto rounded-lg border border-border-default bg-surface-card">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-surface-muted text-left text-xs text-text-muted">
                <th className="px-4 py-2">Data</th>
                <th className="px-4 py-2">Seguidores</th>
                <th className="px-4 py-2">Novos</th>
                <th className="px-4 py-2">Impressões</th>
                <th className="px-4 py-2">Alcance</th>
                <th className="px-4 py-2">Taxa engajamento</th>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).map((snapshot) => (
                <tr key={snapshot.id} className="border-t border-border-light">
                  <td className="px-4 py-2">{snapshot.data_referencia}</td>
                  <td className="px-4 py-2">{snapshot.seguidores_total.toLocaleString('pt-BR')}</td>
                  <td className="px-4 py-2">+{snapshot.seguidores_novos}</td>
                  <td className="px-4 py-2">{snapshot.impressoes.toLocaleString('pt-BR')}</td>
                  <td className="px-4 py-2">{snapshot.alcance.toLocaleString('pt-BR')}</td>
                  <td className="px-4 py-2">{snapshot.taxa_engajamento.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </MainContent>
    </div>
  );
}
