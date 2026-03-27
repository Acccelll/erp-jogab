import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff, RotateCcw, X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { usePreferencesStore, type ModuleId, type ColumnPreference } from '@/shared/stores/preferencesStore';

interface ColumnManagerProps {
  moduleId: ModuleId;
  defaultColumns: ColumnPreference[];
  onClose: () => void;
}

function SortableItem({
  column,
  onToggle,
}: {
  column: ColumnPreference;
  onToggle: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-3 rounded-md border border-border-default bg-white p-2.5 shadow-sm transition-shadow',
        isDragging && 'shadow-md ring-2 ring-brand-primary/20'
      )}
    >
      <button
        type="button"
        className="cursor-grab text-text-subtle hover:text-text-muted active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </button>

      <div className="flex flex-1 items-center gap-2 overflow-hidden">
        <span className="truncate text-sm font-medium text-text-strong">{column.label}</span>
      </div>

      <button
        type="button"
        onClick={() => onToggle(column.id)}
        className={cn(
          'p-1 transition-colors',
          column.visible ? 'text-brand-primary' : 'text-text-subtle hover:text-text-muted'
        )}
        title={column.visible ? 'Ocultar coluna' : 'Exibir coluna'}
      >
        {column.visible ? <Eye size={18} /> : <EyeOff size={18} />}
      </button>
    </div>
  );
}

export function ColumnManager({ moduleId, defaultColumns, onClose }: ColumnManagerProps) {
  const { columns: allPrefs, setColumns, resetColumns } = usePreferencesStore();

  // Initialize with prefs or default
  const [items, setItems] = useState<ColumnPreference[]>(() => {
    const saved = allPrefs[moduleId];
    if (saved && saved.length > 0) {
      // Merge saved with default to handle new columns in code
      const merged = saved.map((s) => {
        const def = defaultColumns.find((d) => d.id === s.id);
        return def ? { ...s, label: def.label } : s;
      });
      // Append any new defaults not in saved
      const missing = defaultColumns.filter((d) => !saved.find((s) => s.id === d.id));
      return [...merged, ...missing];
    }
    return defaultColumns;
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((current) => {
        const oldIndex = current.findIndex((i) => i.id === active.id);
        const newIndex = current.findIndex((i) => i.id === over.id);
        return arrayMove(current, oldIndex, newIndex);
      });
    }
  };

  const handleToggle = (id: string) => {
    setItems((current) =>
      current.map((i) => (i.id === id ? { ...i, visible: !i.visible } : i))
    );
  };

  const handleSave = () => {
    setColumns(moduleId, items);
    onClose();
  };

  const handleReset = () => {
    resetColumns(moduleId);
    setItems(defaultColumns);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between border-b border-border-default pb-4">
        <h3 className="text-lg font-semibold text-text-strong">Personalizar colunas</h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 text-text-subtle hover:bg-surface-soft hover:text-text-muted transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <p className="mb-4 text-xs text-text-muted">
          Arraste para reordenar ou use o olho para alternar a visibilidade das colunas da tabela.
        </p>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {items.map((col) => (
                <SortableItem key={col.id} column={col} onToggle={handleToggle} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <div className="flex items-center justify-between border-t border-border-default pt-4">
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs font-medium text-text-subtle hover:text-brand-primary transition-colors"
        >
          <RotateCcw size={14} />
          Resetar padrão
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border-default px-4 py-1.5 text-sm font-medium text-text-body hover:bg-surface-soft"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md bg-brand-primary px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-brand-primary-hover active:transform active:scale-95 transition-all"
          >
            Salvar e Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}
