import { useState, useRef, useEffect } from 'react';
import { Save, ChevronDown, Trash2, Check, Bookmark } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { usePreferencesStore, type ModuleId, type SavedFilter } from '@/shared/stores/preferencesStore';

interface SavedFiltersProps<TFilters extends Record<string, unknown>> {
  moduleId: ModuleId;
  currentFilters: TFilters;
  onApply: (filters: TFilters) => void;
}

export function SavedFilters<TFilters extends Record<string, unknown>>({
  moduleId,
  currentFilters,
  onApply,
}: SavedFiltersProps<TFilters>) {
  const { savedFilters, saveFilter, deleteFilter } = usePreferencesStore();
  const moduleSavedFilters = savedFilters[moduleId] || [];

  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [filterName, setFilterName] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsSaving(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSave = () => {
    if (!filterName.trim()) return;
    saveFilter(moduleId, {
      name: filterName.trim(),
      filters: currentFilters,
    });
    setFilterName('');
    setIsSaving(false);
  };

  const handleSelect = (filter: SavedFilter) => {
    if (typeof filter.filters === 'object' && filter.filters !== null) {
      onApply(filter.filters as TFilters);
    } else {
      onApply(currentFilters);
    }
    setIsOpen(false);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteFilter(moduleId, id);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 rounded-md border border-border-default bg-white px-2.5 py-1.5 text-sm font-medium transition-all hover:bg-surface-soft',
          isOpen
            ? 'border-brand-primary text-brand-primary ring-2 ring-brand-primary/10'
            : 'text-text-muted hover:text-text-body',
        )}
      >
        <Bookmark size={16} />
        Filtros Salvos
        <ChevronDown size={14} className={cn('transition-transform duration-200', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-[60] mt-1.5 w-64 rounded-lg border border-border-default bg-surface p-2 shadow-elevated animate-in fade-in zoom-in-95 duration-150">
          {/* Section: Save current filters */}
          {!isSaving ? (
            <button
              type="button"
              onClick={() => setIsSaving(true)}
              className="flex w-full items-center gap-2 rounded-md bg-brand-primary/5 px-2.5 py-2 text-xs font-semibold text-brand-primary transition-colors hover:bg-brand-primary/10"
            >
              <Save size={14} />
              Salvar filtros atuais...
            </button>
          ) : (
            <div className="space-y-2 rounded-md bg-surface-muted p-2">
              <input
                autoFocus
                type="text"
                placeholder="Nome do filtro..."
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') setIsSaving(false);
                }}
                className="w-full rounded-md border border-border-default bg-white px-2 py-1.5 text-xs outline-none focus:border-brand-primary"
              />
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!filterName.trim()}
                  className="flex flex-1 items-center justify-center gap-1 rounded bg-brand-primary py-1.5 text-[10px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  <Check size={12} />
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => setIsSaving(false)}
                  className="rounded border border-border-default bg-white px-2 py-1.5 text-[10px] font-bold text-text-muted hover:bg-surface-soft"
                >
                  Sair
                </button>
              </div>
            </div>
          )}

          <div className="my-2 border-t border-border-default/60" />

          {/* Section: List of saved filters */}
          <div className="max-h-48 overflow-y-auto pr-1">
            {moduleSavedFilters.length === 0 ? (
              <p className="py-4 text-center text-xs text-text-subtle italic">Nenhum filtro salvo.</p>
            ) : (
              <ul className="space-y-0.5">
                {moduleSavedFilters.map((sf) => (
                  <li key={sf.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(sf)}
                      className="group flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-xs text-text-body transition-colors hover:bg-surface-soft"
                    >
                      <span className="truncate pr-2 font-medium">{sf.name}</span>
                      <div
                        onClick={(e) => handleDelete(e, sf.id)}
                        className="hidden rounded p-1 text-text-subtle hover:bg-danger-soft hover:text-danger group-hover:block"
                        title="Excluir filtro"
                      >
                        <Trash2 size={12} />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
