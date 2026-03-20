import { useContextStore } from '@/shared/stores';

export function ContextBar() {
  const {
    empresaId,
    filialId,
    obraId,
    competencia,
  } = useContextStore();

  return (
    <div className="flex items-center gap-4 border-b border-gray-100 bg-gray-50 px-6 py-2 text-sm text-gray-600">
      {empresaId && (
        <span className="flex items-center gap-1">
          <span className="font-medium text-gray-700">Empresa:</span>
          <span>{empresaId}</span>
        </span>
      )}
      {filialId && (
        <span className="flex items-center gap-1">
          <span className="font-medium text-gray-700">Filial:</span>
          <span>{filialId}</span>
        </span>
      )}
      {obraId && (
        <span className="flex items-center gap-1">
          <span className="font-medium text-gray-700">Obra:</span>
          <span>{obraId}</span>
        </span>
      )}
      {competencia && (
        <span className="flex items-center gap-1">
          <span className="font-medium text-gray-700">Competência:</span>
          <span>{competencia}</span>
        </span>
      )}
      {!empresaId && !filialId && !obraId && !competencia && (
        <span className="text-gray-400 italic">
          Nenhum contexto selecionado
        </span>
      )}
    </div>
  );
}
