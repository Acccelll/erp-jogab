import type { RelatorioItem } from '../types';

interface RelatorioPreviewPlaceholderProps {
  item: RelatorioItem;
}

export function RelatorioPreviewPlaceholder({ item }: RelatorioPreviewPlaceholderProps) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
      <h4 className="text-sm font-semibold text-gray-900">Pré-visualização / exportação</h4>
      <p className="mt-1 text-sm text-gray-600">Mock de saída para <strong>{item.nome}</strong>. Preparado para exportação em {item.output.formatos.join(', ')} e futura integração com filtros salvos e geração assíncrona.</p>
    </div>
  );
}
