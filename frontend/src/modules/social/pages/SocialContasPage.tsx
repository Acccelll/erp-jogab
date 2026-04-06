import { MainContent, PageHeader, TableSkeleton } from '@/shared/components';
import { useSocialContas, useSyncSocialConta } from '../hooks';

export function SocialContasPage() {
  const { data, isLoading } = useSocialContas();
  const syncMutation = useSyncSocialConta();

  return (
    <div className="flex flex-1 flex-col bg-surface-secondary">
      <PageHeader title="Social · Contas conectadas" subtitle="Gestão operacional de conexões e tokens por plataforma." />
      <MainContent>
        {isLoading && <TableSkeleton rows={4} cols={5} />}
        {data && (
          <div className="overflow-x-auto rounded-lg border border-border-default bg-surface-card">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-surface-muted text-left text-xs text-text-muted">
                  <th className="px-4 py-2">Conta</th>
                  <th className="px-4 py-2">Plataforma</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Última sincronização</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody>
                {data.map((conta) => (
                  <tr key={conta.id} className="border-t border-border-light">
                    <td className="px-4 py-2">{conta.nome_conta}</td>
                    <td className="px-4 py-2">{conta.plataforma === 'instagram_business' ? 'Instagram Business' : 'LinkedIn Page'}</td>
                    <td className="px-4 py-2">{conta.status_conexao}</td>
                    <td className="px-4 py-2">{conta.ultima_sincronizacao ? new Date(conta.ultima_sincronizacao).toLocaleString('pt-BR') : '-'}</td>
                    <td className="px-4 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => syncMutation.mutate(conta.id)}
                        className="rounded-md border border-border-default px-2 py-1 text-xs hover:bg-surface-soft"
                      >
                        Sincronizar agora
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </MainContent>
    </div>
  );
}
