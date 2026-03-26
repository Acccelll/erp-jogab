import { useEffect } from 'react';
import { useBlocker } from 'react-router-dom';
import { useDirtyStore } from '@/shared/stores';

/**
 * Component to globally block navigation when the app is in a dirty state.
 * Uses the React Router v6 useBlocker hook.
 */
export function NavigationBlocker() {
  const { isDirty, message, resetDirty } = useDirtyStore();

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state === 'blocked' && !isDirty) {
      blocker.reset();
    }
  }, [blocker, isDirty]);

  if (blocker.state === 'blocked') {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div className="w-full max-w-sm rounded-lg border border-border-default bg-surface p-6 shadow-elevated animate-in fade-in zoom-in duration-200">
          <h3 className="text-lg font-semibold text-text-strong">Alterações não salvas</h3>
          <p className="mt-2 text-sm text-text-muted">
            {message || 'Você tem alterações que não foram salvas. Deseja realmente sair e descartar as mudanças?'}
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => blocker.reset()}
              className="rounded-md border border-border-default px-4 py-2 text-sm font-medium text-text-body hover:bg-surface-soft transition-colors"
            >
              Continuar editando
            </button>
            <button
              type="button"
              onClick={() => {
                resetDirty();
                blocker.proceed();
              }}
              className="rounded-md bg-danger px-4 py-2 text-sm font-medium text-white hover:bg-danger/90 transition-colors shadow-sm"
            >
              Sair e descartar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
