import { useState } from 'react';
import { MainContent, PageHeader } from '@/shared/components';
import { exportarSocialRelatorio } from '../services/social.service';

export function SocialRelatoriosPage() {
  const [status, setStatus] = useState('');

  async function onExport(formato: 'pdf' | 'xlsx' | 'csv') {
    const result = await exportarSocialRelatorio({ formato, dataInicio: '2026-04-01', dataFim: '2026-04-30' });
    setStatus(`Exportação ${result.status}: ${result.url}`);
  }

  return (
    <div className="flex flex-1 flex-col bg-surface-secondary">
      <PageHeader title="Social · Relatórios" subtitle="Exportação gerencial e rastreável de resultados sociais." />
      <MainContent className="space-y-4">
        <div className="rounded-lg border border-border-default bg-surface-card p-4">
          <p className="mb-3 text-sm text-text-body">Selecione o formato de saída:</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => void onExport('pdf')} className="rounded-md border border-border-default px-3 py-1.5 text-sm">PDF</button>
            <button type="button" onClick={() => void onExport('xlsx')} className="rounded-md border border-border-default px-3 py-1.5 text-sm">Excel</button>
            <button type="button" onClick={() => void onExport('csv')} className="rounded-md border border-border-default px-3 py-1.5 text-sm">CSV</button>
          </div>
          {status && <p className="mt-3 text-xs text-text-muted">{status}</p>}
        </div>
      </MainContent>
    </div>
  );
}
