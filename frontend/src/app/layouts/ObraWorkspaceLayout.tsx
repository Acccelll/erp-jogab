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
      {/* Obra header */}
      <div className="border-b border-gray-200/60 bg-surface px-4 pt-2 pb-0">
        {/* Dynamic header from obra data */}
        {isLoading && (
          <div className="mb-1.5 flex items-center gap-2.5">
            <div className="h-8 w-8 animate-pulse rounded-md bg-gray-200" />
            <div className="space-y-1">
              <div className="h-3.5 w-48 animate-pulse rounded bg-gray-200" />
              <div className="h-2.5 w-32 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        )}

        {!isLoading && obra && (
          <div className="mb-1.5">
            <ObraHeader obra={obra} />
          </div>
        )}

        {!isLoading && !obra && (
          <div className="mb-1.5">
            <p className="text-sm text-gray-500">Obra não encontrada (ID: {obraId})</p>
          </div>
        )}

        {/* Obra tabs with overflow */}
        <OverflowTabs tabs={obraTabs} maxVisible={5} basePath={`/obras/${obraId}`} />
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
