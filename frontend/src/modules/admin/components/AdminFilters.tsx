import { FilterBar } from '@/shared/components';
import { ADMIN_CATEGORIA_LABELS, ADMIN_STATUS_LABELS } from '../types';
import type { AdminCategoria, AdminStatus } from '../types';

interface Props {
  search: string; categoria?: AdminCategoria; status?: AdminStatus; competencia?: string; hasActiveFilters: boolean;
  onSearchChange: (v: string) => void; onCategoriaChange: (v: AdminCategoria | undefined) => void; onStatusChange: (v: AdminStatus | undefined) => void; onCompetenciaChange: (v: string | undefined) => void; onClear: () => void;
}

export function AdminFilters({ search, categoria, status, competencia, hasActiveFilters, onSearchChange, onCategoriaChange, onStatusChange, onCompetenciaChange, onClear }: Props) {
  return (
    <FilterBar onClear={hasActiveFilters ? onClear : undefined}>
      <input value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Buscar por usuário, perfil, permissão, parâmetro, log ou integração" className="h-10 min-w-[260px] flex-1 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500" />
      <select value={categoria ?? ''} onChange={(e) => onCategoriaChange((e.target.value || undefined) as AdminCategoria | undefined)} className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"><option value="">Todas as categorias</option>{Object.entries(ADMIN_CATEGORIA_LABELS).map(([v,l]) => <option key={v} value={v}>{l}</option>)}</select>
      <select value={status ?? ''} onChange={(e) => onStatusChange((e.target.value || undefined) as AdminStatus | undefined)} className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"><option value="">Todos os status</option>{Object.entries(ADMIN_STATUS_LABELS).map(([v,l]) => <option key={v} value={v}>{l}</option>)}</select>
      <input value={competencia ?? ''} onChange={(e) => onCompetenciaChange(e.target.value || undefined)} placeholder="Competência (YYYY-MM)" className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500" />
    </FilterBar>
  );
}
