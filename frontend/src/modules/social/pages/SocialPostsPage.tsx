import { useMemo, useState } from 'react';
import { MainContent, PageHeader } from '@/shared/components';
import { useSocialPosts } from '../hooks';
import type { SocialPostsFilters } from '../types';

export function SocialPostsPage() {
  const [filters, setFilters] = useState<SocialPostsFilters>({});
  const { data } = useSocialPosts(filters);

  const ordered = useMemo(() => [...(data ?? [])].sort((a, b) => b.data_publicacao.localeCompare(a.data_publicacao)), [data]);

  return (
    <div className="flex flex-1 flex-col bg-surface-secondary">
      <PageHeader title="Social · Postagens" subtitle="Análise de desempenho com filtros por rede, período, tipo e campanha." />
      <div className="flex flex-wrap gap-2 border-b border-border-default bg-surface px-6 py-2">
        <select
          value={filters.plataforma ?? ''}
          onChange={(e) => setFilters((prev) => ({ ...prev, plataforma: (e.target.value || undefined) as SocialPostsFilters['plataforma'] }))}
          className="rounded-md border border-border-default px-2 py-1 text-sm"
        >
          <option value="">Rede</option>
          <option value="instagram_business">Instagram</option>
          <option value="linkedin_page">LinkedIn</option>
        </select>
        <select
          value={filters.tipoPost ?? ''}
          onChange={(e) => setFilters((prev) => ({ ...prev, tipoPost: (e.target.value || undefined) as SocialPostsFilters['tipoPost'] }))}
          className="rounded-md border border-border-default px-2 py-1 text-sm"
        >
          <option value="">Tipo</option>
          <option value="feed">Feed</option>
          <option value="reel">Reel</option>
          <option value="artigo">Artigo</option>
          <option value="video">Vídeo</option>
        </select>
        <input type="date" className="rounded-md border border-border-default px-2 py-1 text-sm" onChange={(e) => setFilters((prev) => ({ ...prev, dataInicio: e.target.value || undefined }))} />
        <input type="date" className="rounded-md border border-border-default px-2 py-1 text-sm" onChange={(e) => setFilters((prev) => ({ ...prev, dataFim: e.target.value || undefined }))} />
      </div>

      <MainContent>
        <div className="overflow-x-auto rounded-lg border border-border-default bg-surface-card">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-surface-muted text-left text-xs text-text-muted">
                <th className="px-4 py-2">Publicação</th>
                <th className="px-4 py-2">Tipo</th>
                <th className="px-4 py-2">Impressões</th>
                <th className="px-4 py-2">Alcance</th>
                <th className="px-4 py-2">Engajamento</th>
                <th className="px-4 py-2">Taxa</th>
              </tr>
            </thead>
            <tbody>
              {ordered.map((post) => (
                <tr key={post.id} className="border-t border-border-light">
                  <td className="px-4 py-2">
                    <div className="font-medium text-text-strong">{post.titulo_legenda}</div>
                    <div className="text-xs text-text-muted">{new Date(post.data_publicacao).toLocaleDateString('pt-BR')}</div>
                  </td>
                  <td className="px-4 py-2">{post.tipo_post}</td>
                  <td className="px-4 py-2">{post.impressoes.toLocaleString('pt-BR')}</td>
                  <td className="px-4 py-2">{post.alcance.toLocaleString('pt-BR')}</td>
                  <td className="px-4 py-2">{post.engajamento_total.toLocaleString('pt-BR')}</td>
                  <td className="px-4 py-2">{post.taxa_engajamento.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </MainContent>
    </div>
  );
}
