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
  { label: 'RH', path: 'rh' },
  { label: 'Contratos', path: 'contratos' },
  { label: 'Compras', path: 'compras' },
  { label: 'Estoque', path: 'estoque' },
  { label: 'Medições', path: 'medicoes' },
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
    <div className="flex flex-1 flex-col overflow-hidden bg-surface-secondary">
      {/* Obra header + tabs — unified context strip */}
      <div className="z-10 border-b border-border-default/60 bg-surface px-4 pt-3 pb-0 shadow-sm">
        {isLoading && (
          <div className="mb-3 flex items-center gap-2">
            <div className="h-6 w-6 animate-pulse rounded bg-surface-muted" />
            <div className="h-4 w-48 animate-pulse rounded bg-surface-muted" />
          </div>
        )}

        {!isLoading && obra && (
          <div className="mb-3">
            <ObraHeader obra={obra} />
          </div>
        )}

        {!isLoading && !obra && (
          <div className="mb-3 px-1 py-1">
            <p className="text-sm font-medium text-danger">Obra não encontrada (ID: {obraId})</p>
          </div>
        )}

        <div className="flex items-center">
          <OverflowTabs tabs={obraTabs} maxVisible={7} basePath={`/obras/${obraId}`} />
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
