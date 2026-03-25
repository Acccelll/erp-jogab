import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useContextStore } from '@/shared/stores';
import { OverflowTabs } from '@/shared/components';
import { ObraHeader } from '@/modules/obras/components/ObraHeader';
import { useObraDetails } from '@/modules/obras/hooks/useObraDetails';

const obraTabs = [
  { label: 'Visão Geral', path: '' },
  { label: 'Cronograma', path: 'cronograma' },
  { label: 'Financeiro', path: 'financeiro' },
  { label: 'Equipe', path: 'equipe' },
  { label: 'Compras', path: 'compras' },
  { label: 'RH', path: 'rh' },
  { label: 'Estoque', path: 'estoque' },
  { label: 'Medições', path: 'medicoes' },
  { label: 'Contratos', path: 'contratos' },
  { label: 'Documentos', path: 'documentos' },
  { label: 'Riscos', path: 'riscos' },
];

export function ObraWorkspaceLayout() {
  const { obraId } = useParams<{ obraId: string }>();
  const { setObra, obraId: contextObraId } = useContextStore();
  const { obra, isLoading } = useObraDetails(obraId);

  // Sync obra context when entering the workspace
  useEffect(() => {
    if (obraId && obraId !== contextObraId) {
      setObra(obraId);
    }
  }, [obraId, contextObraId, setObra]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Obra header + tabs — unified compact strip */}
      <div className="border-b border-border-default bg-surface px-4 pt-1 pb-0">
        {isLoading && (
          <div className="mb-1 flex items-center gap-2">
            <div className="h-6 w-6 animate-pulse rounded bg-surface-soft" />
            <div className="h-3 w-40 animate-pulse rounded bg-surface-soft" />
          </div>
        )}

        {!isLoading && obra && (
          <div className="mb-1">
            <ObraHeader obra={obra} />
          </div>
        )}

        {!isLoading && !obra && (
          <div className="mb-1">
            <p className="text-sm text-text-muted">Obra não encontrada (ID: {obraId})</p>
          </div>
        )}

        <OverflowTabs tabs={obraTabs} maxVisible={5} basePath={`/obras/${obraId}`} />
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
