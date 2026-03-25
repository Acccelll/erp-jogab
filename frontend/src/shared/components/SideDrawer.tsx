import { useDrawerStore } from '@/shared/stores';
import { X } from 'lucide-react';

export function SideDrawer() {
  const { isOpen, title, content, width, closeDrawer } = useDrawerStore();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/30"
        onClick={closeDrawer}
        onKeyDown={(e) => {
          if (e.key === 'Escape') closeDrawer();
        }}
        role="button"
        tabIndex={-1}
        aria-label="Fechar drawer"
      />

      {/* Drawer */}
      <aside
        className="fixed right-0 top-0 z-50 flex h-full flex-col border-l border-border-default bg-surface-card shadow-overlay"
        style={{ width: width ?? '480px' }}
      >
        <div className="flex items-center justify-between border-b border-border-default px-4 py-3">
          <h2 className="text-lg font-semibold text-text-strong">{title}</h2>
          <button
            type="button"
            onClick={closeDrawer}
            className="rounded p-1 text-text-muted hover:bg-surface-soft hover:text-text-body"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4">{content}</div>
      </aside>
    </>
  );
}
