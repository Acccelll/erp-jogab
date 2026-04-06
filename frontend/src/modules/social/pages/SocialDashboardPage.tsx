import { Link } from 'react-router-dom';
import { MainContent, PageHeader, TableSkeleton } from '@/shared/components';
import { useSocialDashboard } from '../hooks';

export function SocialDashboardPage() {
  const { data, isLoading } = useSocialDashboard();

  return (
    <div className="flex flex-1 flex-col bg-surface-secondary">
      <PageHeader
        title="Social"
        subtitle="Dashboard consolidado de Instagram Business e LinkedIn Page."
        actions={
          <div className="flex gap-2">
            <Link to="/social/contas" className="rounded-md border border-border-default bg-surface px-3 py-1.5 text-sm">
              Contas conectadas
            </Link>
            <Link to="/social/posts" className="rounded-md bg-brand-primary px-3 py-1.5 text-sm text-white">
              Ver posts
            </Link>
          </div>
        }
      />

      <MainContent className="space-y-4">
        {isLoading && <TableSkeleton rows={6} cols={4} />}
        {data && (
          <>
            <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <article className="rounded-lg border border-border-default bg-surface-card p-4">
                <p className="text-xs text-text-subtle">Seguidores Instagram</p>
                <p className="text-2xl font-semibold text-text-strong">{data.resumo.totalSeguidoresInstagram.toLocaleString('pt-BR')}</p>
              </article>
              <article className="rounded-lg border border-border-default bg-surface-card p-4">
                <p className="text-xs text-text-subtle">Seguidores LinkedIn</p>
                <p className="text-2xl font-semibold text-text-strong">{data.resumo.totalSeguidoresLinkedin.toLocaleString('pt-BR')}</p>
              </article>
              <article className="rounded-lg border border-border-default bg-surface-card p-4">
                <p className="text-xs text-text-subtle">Crescimento no período</p>
                <p className="text-2xl font-semibold text-emerald-600">+{data.resumo.crescimentoSeguidoresPeriodo}</p>
              </article>
            </section>

            <section className="rounded-lg border border-border-default bg-surface-card">
              <div className="border-b border-border-light px-4 py-2 text-sm font-medium text-text-strong">Comparativo por rede</div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-surface-muted text-left text-xs text-text-muted">
                      <th className="px-4 py-2">Plataforma</th>
                      <th className="px-4 py-2">Seguidores</th>
                      <th className="px-4 py-2">Crescimento</th>
                      <th className="px-4 py-2">Engajamento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.comparativoPlataformas.map((item) => (
                      <tr key={item.plataforma} className="border-t border-border-light">
                        <td className="px-4 py-2">{item.plataforma === 'instagram_business' ? 'Instagram Business' : 'LinkedIn Page'}</td>
                        <td className="px-4 py-2">{item.seguidores.toLocaleString('pt-BR')}</td>
                        <td className="px-4 py-2">+{item.crescimento}</td>
                        <td className="px-4 py-2">{item.engajamento.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-lg border border-border-default bg-surface-card">
              <div className="border-b border-border-light px-4 py-2 text-sm font-medium text-text-strong">Melhores posts</div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-surface-muted text-left text-xs text-text-muted">
                      <th className="px-4 py-2">Post</th>
                      <th className="px-4 py-2">Impressões</th>
                      <th className="px-4 py-2">Engajamento</th>
                      <th className="px-4 py-2">Taxa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.melhoresPosts.map((post) => (
                      <tr key={post.id} className="border-t border-border-light">
                        <td className="px-4 py-2">{post.titulo_legenda}</td>
                        <td className="px-4 py-2">{post.impressoes.toLocaleString('pt-BR')}</td>
                        <td className="px-4 py-2">{post.engajamento_total.toLocaleString('pt-BR')}</td>
                        <td className="px-4 py-2">{post.taxa_engajamento.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </MainContent>
    </div>
  );
}
